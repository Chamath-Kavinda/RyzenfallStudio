import { useEffect, useRef } from "react";

/**
 * Subscribe to the backend WebSocket with automatic reconnection.
 * onMessage receives the parsed { type, payload } object.
 */
export function useWebSocket(onMessage) {
  const handlerRef = useRef(onMessage);
  handlerRef.current = onMessage;

  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL || "ws://localhost:5000/ws";
    let ws;
    let reconnectTimer;
    let closedByUnmount = false;

    const connect = () => {
      ws = new WebSocket(url);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handlerRef.current?.(data);
        } catch {
          // Ignore malformed frames.
        }
      };

      ws.onclose = () => {
        if (closedByUnmount) return;
        reconnectTimer = setTimeout(connect, 2000);
      };

      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      closedByUnmount = true;
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);
}
