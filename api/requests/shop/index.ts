import { api } from "@/api/instance";

export type PostOrdersConfig = FetchRequestConfig<PostOrdersRequest>;
export const postOrders = async ({ params, config }: PostOrdersConfig) =>
  api.post<PostOrdersResponse>("/shop/orders", params, config?.headers);
