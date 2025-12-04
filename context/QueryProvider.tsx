"use client";

import { isServer, QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 60 * 1000 // 1 hour
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
};
