import { useEffect, useRef, useState, useCallback } from "react";
import { getWebSocketUrl } from "@/api/utils/websocket";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export type WebSocketConnectionState = "connecting" | "connected" | "disconnected" | "error";

export interface GameWebSocketMessage {
  event: string;
  new_bonus_balance?: number;
  current_energy?: number;
  detail?: string;
}

export interface UseGameWebSocketReturn {
  connectionState: WebSocketConnectionState;
  sendClick: () => void;
  coins: number;
  energy: number;
  error: string | null;
}

const RECONNECT_DELAY = 1000;
const MAX_RECONNECT_DELAY = 30000;
const RECONNECT_ATTEMPTS = 5;

export const useGameWebSocket = (
  telegramId: string | number | undefined,
  initialCoins: number = 0,
  initialEnergy: number = 0
): UseGameWebSocketReturn => {
  const [connectionState, setConnectionState] = useState<WebSocketConnectionState>("disconnected");
  const [coins, setCoins] = useState(initialCoins);
  const [energy, setEnergy] = useState(initialEnergy);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(true);

  const connect = useCallback(() => {
    if (!telegramId || typeof window === "undefined") {
      return;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      // baseUrl already includes /api, so endpoint should be /game/ws
      const wsUrl = getWebSocketUrl(baseUrl, "/game/ws", telegramId);
      console.log("Connecting to WebSocket:", {
        url: wsUrl,
        telegramId,
        baseUrl,
        endpoint: "/game/ws"
      });
      setConnectionState("connecting");
      setError(null);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected successfully");
        setConnectionState("connected");
        reconnectAttemptsRef.current = 0;
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const message: GameWebSocketMessage = JSON.parse(event.data);

          if (message.event === "click") {
            if (typeof message.new_bonus_balance === "number") {
              setCoins(message.new_bonus_balance);
            }
            if (typeof message.current_energy === "number") {
              setEnergy(message.current_energy);
            }
          } else if (message.detail) {
            // Error message from server
            setError(message.detail);
            setConnectionState("error");
          }
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err);
          setError("Failed to parse server response");
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", {
          event,
          readyState: ws.readyState,
          url: wsUrl,
          telegramId
        });
        setConnectionState("error");
        // Don't set error here - onclose will handle it with more details
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          url: wsUrl
        });

        wsRef.current = null;

        // Handle specific error codes from backend
        if (event.code === 4401) {
          // Unauthorized - missing or invalid telegram_id
          setError("Ошибка авторизации: не передан Telegram ID");
          setConnectionState("error");
          shouldReconnectRef.current = false; // Don't retry auth errors
          return;
        }

        if (event.code === 4403) {
          // Forbidden - user role is not CHILD
          setError("Игра доступна только для ребенка");
          setConnectionState("error");
          shouldReconnectRef.current = false; // Don't retry permission errors
          return;
        }

        // Code 1006 = Abnormal Closure (connection closed without close frame)
        // This usually means server rejected connection or network issue
        if (event.code === 1006) {
          setError(
            "Не удалось установить соединение с сервером. Проверьте подключение к интернету и настройки сервера."
          );
          setConnectionState("error");

          // Don't retry immediately on 1006 - might be server configuration issue
          if (shouldReconnectRef.current && reconnectAttemptsRef.current < RECONNECT_ATTEMPTS) {
            const delay = Math.min(RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current), MAX_RECONNECT_DELAY);
            reconnectAttemptsRef.current += 1;
            console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${RECONNECT_ATTEMPTS})`);

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, delay);
          } else if (reconnectAttemptsRef.current >= RECONNECT_ATTEMPTS) {
            setError(
              "Не удалось подключиться после нескольких попыток. Возможно, проблема с настройками сервера или сетью."
            );
          }
          return;
        }

        // Normal closure or other errors
        setConnectionState("disconnected");

        // Attempt reconnection if not intentionally closed and not an auth error
        if (shouldReconnectRef.current && reconnectAttemptsRef.current < RECONNECT_ATTEMPTS) {
          const delay = Math.min(RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current), MAX_RECONNECT_DELAY);
          reconnectAttemptsRef.current += 1;
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${RECONNECT_ATTEMPTS})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= RECONNECT_ATTEMPTS) {
          console.error("Max reconnection attempts reached");
          setError(`Не удалось подключиться после ${RECONNECT_ATTEMPTS} попыток. Код ошибки: ${event.code}`);
        } else if (!event.wasClean && event.code !== 1000) {
          // Unexpected close with error code
          setError(
            `Соединение закрыто с ошибкой. Код: ${event.code}${event.reason ? `, причина: ${event.reason}` : ""}`
          );
        }
      };
    } catch (err) {
      console.error("Failed to create WebSocket connection:", err);
      setConnectionState("error");
      setError(err instanceof Error ? err.message : "Failed to establish connection");
    }
  }, [telegramId]);

  const sendClick = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({ type: "click" }));
      } catch (err) {
        console.error("Failed to send click message:", err);
        setError("Failed to send click");
      }
    } else {
      setError("Not connected to server");
    }
  }, []);

  // Connect on mount and when telegramId changes
  useEffect(() => {
    if (telegramId) {
      shouldReconnectRef.current = true;
      connect();
    }

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [telegramId, connect]);

  // Update initial values when they change externally, but only if not connected yet
  useEffect(() => {
    if (connectionState === "disconnected" || connectionState === "connecting") {
      setCoins(initialCoins);
    }
  }, [initialCoins, connectionState]);

  useEffect(() => {
    if (connectionState === "disconnected" || connectionState === "connecting") {
      setEnergy(initialEnergy);
    }
  }, [initialEnergy, connectionState]);

  return {
    connectionState,
    sendClick,
    coins,
    energy,
    error
  };
};
