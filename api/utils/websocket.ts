/**
 * Converts HTTP/HTTPS URL to WebSocket URL (ws/wss)
 * Automatically uses wss:// if page is loaded over HTTPS (security requirement)
 */
export const getWebSocketUrl = (baseUrl: string, endpoint: string, telegramId: string | number): string => {
  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Check if page is loaded over HTTPS
  const isSecurePage = typeof window !== "undefined" && window.location.protocol === "https:";

  // Convert http to ws, https to wss
  let wsUrl = cleanBaseUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:");

  // If page is HTTPS but baseUrl was HTTP, force upgrade to wss://
  // This is required by browsers: HTTPS pages cannot use insecure ws:// connections
  if (isSecurePage && wsUrl.startsWith("ws://")) {
    wsUrl = wsUrl.replace(/^ws:/, "wss:");
  }

  // Add endpoint
  wsUrl += cleanEndpoint;

  // Add authentication query parameter
  wsUrl += `?telegram_id=${encodeURIComponent(telegramId)}`;

  return wsUrl;
};
