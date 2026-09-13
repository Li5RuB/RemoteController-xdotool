const ws = new WebSocket(window.WS_URL);
ws.binaryType = 'arraybuffer';

const buffer = new ArrayBuffer(6);
const view = new DataView(buffer);

ws.onopen = () => {
  console.log("ws connected");
};

ws.onmessage = (event) => {
  console.log("Message from server:", event.data);
};

ws.onerror = (err) => {
  console.log("error:", err);
};

ws.onclose = () => {
  console.log("ws close");
};


const textEncoder = new TextEncoder();

const EVENTS = {
  MOVE: 0,
  CLICK: 1,
  KEY: 2,
  TEXT: 3,
  SCROLL: 4,
  HOLD_START: 5,
  HOLD_END: 6,
  FILE: 7,
};

const sendType = {
  coords: 0,
  int16: 1,
  string: 2,
  float32: 3
}

function sendBinaryEvent(eventId, payload = null, type = null) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  
  if (ws.binaryType !== 'arraybuffer') {
    ws.binaryType = 'arraybuffer';
  }

  let buffer;
  let view;

  if (type === sendType.coords) {
    buffer = new ArrayBuffer(10);
    view = new DataView(buffer);
    view.setInt16(0, eventId, true);
    view.setFloat32(2, payload[0],true);
    view.setFloat32(6, payload[1], true);
  } 
  else if (type === sendType.int16) {
    buffer = new ArrayBuffer(4);
    view = new DataView(buffer);
    view.setInt16(0, eventId, true);
    view.setInt16(2, payload, true);
  }
  else if (type === sendType.float32) {
    buffer = new ArrayBuffer(6);
    view = new DataView(buffer);
    view.setInt16(0, eventId, true);
    view.setFloat32(2, payload, true);
  } 
  else if (type === sendType.string) {
    const stringBytes = textEncoder.encode(payload);
    buffer = new ArrayBuffer(2 + stringBytes.length);
    view = new DataView(buffer);
    view.setInt16(0, eventId, true);
    
    const destArray = new Uint8Array(buffer, 2);
    destArray.set(stringBytes);
  } 
  else {
    buffer = new ArrayBuffer(2);
    view = new DataView(buffer);
    view.setInt16(0, eventId, true);
  }

  ws.send(buffer);
}
