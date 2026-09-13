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
    sendBinaryEvent(EVENTS.HOLD_START);
  }
}, { passive: false });

pad.addEventListener('touchend', e => {
  const fingers = e.touches.length;

  if (fingers === 0) {
    sendBinaryEvent(EVENTS.HOLD_END);
  }

  const tapDuration = Date.now() - touchStartTime;
  if (!moved && tapDuration < 100){
    sendClick(1);
  }


  lastX = lastY = null;
});


function throtteledMoveSend(dx, dy) {
  const now = Date.now();
  if (now - lastSend > 5) {
    sendBinaryEvent(EVENTS.MOVE, [dx, dy], sendType.coords);
    lastSend = now;
  }
}

function throtteledScrollSend(dy) {
  const now = Date.now();
  if (now - lastSend > 5) {
    sendBinaryEvent(EVENTS.SCROLL, dy, sendType.float32);
    lastSend = now;
  }
}

function sendClick(key) {
  sendBinaryEvent(EVENTS.CLICK, key, sendType.int16);
}

function sendKey(key) {
  sendBinaryEvent(EVENTS.KEY, String(key), sendType.string);
}