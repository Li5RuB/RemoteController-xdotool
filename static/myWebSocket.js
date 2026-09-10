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
