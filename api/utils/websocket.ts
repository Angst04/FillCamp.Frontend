/**
 * Converts HTTP/HTTPS URL to WebSocket URL (ws/wss)
 */
export const getWebSocketUrl = (baseUrl: string, endpoint: string, telegramId: string | number): string => {
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Convert http to ws, https to wss
  let wsUrl = cleanBaseUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:");

  // Add endpoint
  wsUrl += cleanEndpoint;

  // Add authentication query parameter
  wsUrl += `?telegram_id=${encodeURIComponent(telegramId)}`;

  return wsUrl;
};
