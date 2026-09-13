import json
import socket
import subprocess
import os
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pynput.mouse import Controller as MouseController
import uvicorn
import struct

ID_FORMAT = "<h" 
MOUSE_FORMAT = "<ff"
SINGLE_INT_FORMAT = "<h"
SINGLE_FLOAT_FORMAT = "<f"
NAME_LEN_FORMAT = "<h"

HANDLERS = {
    0 : lambda payload: move_mouse(*struct.unpack(MOUSE_FORMAT, payload)) if len(payload) == 8 else None,
    #0 : lambda payload: move_mouse(params[0], params[1]), #"move"
    1 : lambda payload: click(struct.unpack(SINGLE_INT_FORMAT, payload)[0]) if len(payload) == 2 else None,
    #1 : lambda payload: click(params[0]), #click
    2 : lambda payload: press_key(payload.decode('utf-8')), 
    #2 : lambda payload: press_key(params[0]), #key
    3 : lambda payload: send_unicode(payload.decode('utf-8')), 
    #3 : lambda payload: send_unicode(params[0]), #text
    4 : lambda payload: scroll(struct.unpack(SINGLE_FLOAT_FORMAT, payload)[0]) if len(payload) == 4 else None,
    #4 : lambda payload: scroll(params[0]), #scroll
    5 : lambda payload: hold_start(), 
    6 : lambda payload: hold_end(), 
    #5 : lambda payload: hold_start(), #hold_start
    #6 : lambda payload: hold_end(), #hold_end
    7 : lambda payload: save_received_file(payload), 
}

mouse = MouseController()


def save_received_file(payload):
    if len(payload) < 2:
        return
        
    name_len = struct.unpack(NAME_LEN_FORMAT, payload[:2])[0]
    
    if len(payload) < (2 + name_len):
        print("Ошибка: Пакет файла поврежден или обрезался.")
        return
        
    file_name_bytes = payload[2 : 2 + name_len]
    file_name = file_name_bytes.decode('utf-8')
    file_content = payload[2 + name_len :]
    
    try:
        downloads_dir = Path.home() / "Downloads"
        
        downloads_dir.mkdir(parents=True, exist_ok=True)
        
        full_path = downloads_dir / file_name
        
        with open(full_path, "wb") as f:
            f.write(file_content)
            
        os.chmod(full_path, 0o644)
        
        print(f" Успешно сохранено в Linux: {full_path} (Права: 644)")
        
    except Exception as e:
        print(f"Ошибка при сохранении файла на ПК: {e}")

def send_unicode(char):
    subprocess.run(["xdotool", "type", "--clearmodifiers","--delay", "40", char])


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]
    finally:
        s.close()


def hold_start():
    subprocess.run(["xdotool", "mousedown", "1"])


def hold_end():
    subprocess.run(["xdotool", "mouseup", "1"])


def move_mouse(dx, dy):
    subprocess.run(["xdotool", "mousemove_relative", "--", str(dx), str(dy)])


def click(button):
    subprocess.run(["xdotool", "click", str(button)])


def press_key(key):
    subprocess.run(["xdotool", "key", key])


accumulator = 0.0

def scroll(dy):
    global accumulator
    accumulator += dy
    
    steps = int(accumulator)
    if steps != 0:
        mouse.scroll(0, steps)
        accumulator -= steps


BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = os.path.join(BASE_DIR, "static")


app = FastAPI()

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

LOCAL_IP = get_local_ip()

print(LOCAL_IP);


@app.get("/")
async def root():
    html_file = BASE_DIR / "static" / "index.html"
    with open(html_file, "r") as f:
        html = f.read().replace("{{WS_IP}}", LOCAL_IP)
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_bytes()
            if len(data) < 2:
                continue

            event_id = struct.unpack(ID_FORMAT, data[:2])[0]
            
            payload = data[2:]
            
            handler = HANDLERS.get(event_id)

            if handler:
                try:
                    handler(payload)
                except Exception as e:
                    print(f"Error handling event {event_id}: {e}")
            else:
                print(f"Unknown event ID: {event_id}")
                
    except WebSocketDisconnect:
        print("Client disconnected")


if __name__ == "__main__":
    print(f"Server running at: http://{LOCAL_IP}:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
