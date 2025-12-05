declare global {
  type SearchParams = { [key: string]: string | string[] | undefined };

  interface RequestOptions extends RequestInit {
    headers?: Record<string, string>;
    params?: SearchParams;
  }

  type FetchRequestConfig<Params = undefined> = Params extends undefined
    ? { config?: RequestOptions }
    : { params: Params; config?: RequestOptions };

  interface ErrorDetail {
    detail: string;
  }

  interface ValidationErrorDetail {
    detail: Array<{
      loc: string[];
      msg: string;
      type: string;
    }>;
  }

  interface ApiResponse<T> {
    success: boolean;
    status: number;
    statusText: string;
    data?: T;
    error?: ErrorDetail | ValidationErrorDetail;
  }
}

export {};
