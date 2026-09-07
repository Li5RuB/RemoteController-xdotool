const ws = new WebSocket(window.WS_URL);

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

let lastX = null;
let lastY = null;
let lastSend = 0;
let touchStartTime = 0;
let moved = false;

const pad = document.getElementById("pad");
const scrol = document.getElementById("scrol");

let lastScrolly = null;

let moveSensivity = 3;

const SCROLL_SENSITIVITY = 10; 

scrol.addEventListener("touchmove", e => {
  const t = e.touches[0];
  if (lastScrolly != null) {
    let dy = (t.clientY - lastScrolly) / SCROLL_SENSITIVITY;

    throtteledScrollSend(dy)
    console.log("scroll:", dy);
  }
  lastScrolly = t.clientY;
}, { passive: false });

scrol.addEventListener('touchend', () => {
  lastScrolly = null;
});


pad.addEventListener("touchmove", e => {
  const t = e.touches[0];
  moved = true;

  if (lastX !== null) {
    const dx = t.clientX - lastX;
    const dy = t.clientY - lastY;
    throtteledMoveSend(dx * moveSensivity, dy * moveSensivity);
  }
  lastX = t.clientX;
  lastY = t.clientY;
}, { passive: false });

pad.addEventListener('touchstart', e => {
  const fingers = e.touches.length;
  touchStartTime = Date.now();
  moved = false;

  if (fingers === 2) {
    // удержание
    ws.send(JSON.stringify({ type: "hold_start" }));
  }
}, { passive: false });

pad.addEventListener('touchend', e => {
  const fingers = e.touches.length;

  if (fingers === 0) {
    ws.send(JSON.stringify({ type: "hold_end" }));
  }

  const tapDuration = Date.now() - touchStartTime;
  if (!moved && tapDuration < 100){
    sendClick('1')
  }


  lastX = lastY = null;
});


function throtteledMoveSend(dx, dy) {
  const now = Date.now();
  if (now - lastSend > 5) {
    ws.send(JSON.stringify({ type: "move", dx, dy }));
    lastSend = now;
  }
}

function throtteledScrollSend(dy) {
  const now = Date.now();
  if (now - lastSend > 5) {
    ws.send(JSON.stringify({ type: 'scroll', dy }));
    lastSend = now;
  }
}

function sendClick(key) {
  console.log("Send click");
  ws.send(JSON.stringify({ type: "click", key: key }));
}

function sendKey(key) {
  console.log("Send key");
  ws.send(JSON.stringify({ type: "key", key: key }));
}