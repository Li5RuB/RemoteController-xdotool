import json
import socket
import subprocess
import os
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pynput.mouse import Controller as MouseController
from pynput.keyboard import Controller as KeyboardController
import uvicorn

HANDLERS = {
    "move": lambda payload: move_mouse(payload["dx"], payload["dy"]),
    "click": lambda payload: click(payload["key"]),
    "key": lambda payload: press_key(payload["key"]),
    "text": lambda payload: send_unicode(payload["key"]),
    "scroll": lambda payload: scroll(payload["dy"]),
    "hold_start": lambda payload: hold_start(),
    "hold_end": lambda payload: hold_end(),
}

mouse = MouseController()
keyboard = KeyboardController()


def send_unicode(char):
    subprocess.run(["xdotool", "type", "--clearmodifiers", char])


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
    subprocess.run(["xdotool", "click", button])


def press_key(key):
    subprocess.run(["xdotool", "key", key])


def scroll(dy):
    mouse.scroll(0, dy)


BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = os.path.join(BASE_DIR, "static")


app = FastAPI()

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

LOCAL_IP = get_local_ip()


@app.get("/")
async def root():
    with open("static/index.html", "r") as f:
        html = f.read().replace("{{WS_IP}}", LOCAL_IP)
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_text()
            msg = json.loads(data)

            msg_type = msg.get("type")
            handler = HANDLERS.get(msg_type)

            if handler:
                handler(msg)  # Просто вызываем нужную функцию
            else:
                print(f"Unknown message type: {msg_type}")
    except WebSocketDisconnect:
        print("Client disconnected")


if __name__ == "__main__":
    print(f"Server running at: http://{LOCAL_IP}:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
