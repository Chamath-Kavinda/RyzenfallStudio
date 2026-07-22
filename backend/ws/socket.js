import { WebSocketServer } from "ws";

let wss = null;

export function initWebSocket(server) {
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws) => {
    ws.isAlive = true;
    ws.on("pong", () => {
      ws.isAlive = true;
    });
  });

  // Drop dead connections so broadcasts stay clean.
  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => clearInterval(interval));
  console.log("WebSocket server ready on /ws");
}

export function broadcast(type, payload) {
  if (!wss) return;
  const data = JSON.stringify({ type, payload });
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(data);
  });
}
