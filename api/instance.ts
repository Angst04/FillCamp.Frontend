export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private createSearchParams(params: SearchParams) {
    const searchParams = new URLSearchParams();

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key];

        if (Array.isArray(value)) {
          value.forEach((currentValue) => searchParams.append(key, currentValue));
        } else if (value) {
          searchParams.set(key, value);
        }
      }
    }

    return `?${searchParams.toString()}`;
  }

  private detectContentType(body: Record<string, any> | FormData | undefined): string | undefined {
    if (!body) return undefined;

    if (body instanceof FormData) {
      return undefined;
    }

    if (typeof body === "object" && !Array.isArray(body)) {
      return "application/json";
    }

    return undefined;
  }

  private prepareBody(body: Record<string, any> | FormData | undefined): string | FormData | undefined {
    if (!body) return undefined;

    if (body instanceof FormData) {
      return body;
    }

    return JSON.stringify(body);
  }

  private async request<T>(
    endpoint: string,
    method: RequestInit["method"],
    body?: Record<string, any> | FormData | undefined,
    customHeaders?: Record<string, string>,
    queryParams?: SearchParams
  ): Promise<ApiResponse<T>> {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint;
    let url = `${this.baseUrl}/${cleanEndpoint}`;

    if (queryParams) {
      url += this.createSearchParams(queryParams);
    }

    const preparedBody = this.prepareBody(body);
    const contentType = this.detectContentType(body);

    const headers: Record<string, string> = {
      ...(contentType && { "Content-Type": contentType }),
      ...customHeaders
    };

    const config: RequestInit = {
      method,
      // credentials: "include",
      headers,
      next: {
        revalidate: 300
      }
    };

    if (preparedBody !== undefined) {
      config.body = preparedBody;
    }

    try {
      const response = await fetch(url, config);

      let data: T | undefined;
      let error: ErrorDetail | ValidationErrorDetail | undefined;

      const json = await response.json();

      if (response.ok) {
        data = json as T;
      } else {
        if (response.status === 422) {
          error = { detail: json.detail };
        } else {
          error = { detail: json.detail || "Unknown error" };
        }
      }

      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
        error
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        statusText: "Network Error",
        data: undefined,
        error: {
          detail: error instanceof Error ? error.message : String(error)
        }
      };
    }
  }

  get<T>(
    endpoint: string,
    customHeaders?: Record<string, string>,
    queryParams?: SearchParams
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "GET", undefined, customHeaders, queryParams);
  }

  post<T>(
    endpoint: string,
    body?: Record<string, any> | FormData,
    customHeaders?: Record<string, string>,
    queryParams?: SearchParams
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "POST", body, customHeaders, queryParams);
  }

  put<T>(
    endpoint: string,
    body?: Record<string, any> | FormData,
    customHeaders?: Record<string, string>,
    queryParams?: SearchParams
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PUT", body, customHeaders, queryParams);
  }

  delete<T>(
    endpoint: string,
    body?: Record<string, any> | FormData,
    customHeaders?: Record<string, string>,
    queryParams?: SearchParams
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "DELETE", body, customHeaders, queryParams);
  }

  patch<T>(
    endpoint: string,
    body?: Record<string, any> | FormData,
    customHeaders?: Record<string, string>,
    queryParams?: SearchParams
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PATCH", body, customHeaders, queryParams);
  }
}

// For server-side requests (SSR, API routes), use internal HTTP URL
// For client-side requests, use the public URL (which can be HTTPS)
const getBaseUrl = () => {
  // Server-side: use internal API_BASE_URL (HTTP) or fallback to nginx
  if (typeof window === "undefined") {
    return process.env.API_BASE_URL || "http://nginx/api";
  }

  // Client-side: use public URL (must match page protocol to avoid mixed content)
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (envUrl) {
    // If environment variable is set, ensure it uses HTTPS if page is HTTPS
    try {
      const url = new URL(envUrl);
      // If page is HTTPS and env URL is HTTP, upgrade to HTTPS
      if (window.location.protocol === "https:" && url.protocol === "http:") {
        url.protocol = "https:";
        return url.toString();
      }
      return envUrl;
    } catch {
      // If URL parsing fails, return as-is (might be relative)
      return envUrl;
    }
  }

  // Fallback: detect protocol from current page
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  // For production (campminiapp.ru), use same protocol as page
  if (hostname === "campminiapp.ru" || hostname.includes("campminiapp.ru")) {
    return `${protocol}//${hostname}/api`;
  }

  // For local development, use HTTP
  return "http://localhost:8000/api";
};

const baseUrl = getBaseUrl();
export const api = new HttpClient(baseUrl);
