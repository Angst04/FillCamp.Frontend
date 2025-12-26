import { api } from "@/api/instance";

export type PostUserConfig = FetchRequestConfig<PostUserRequest>;
export const postUser = async ({ params, config }: PostUserConfig) =>
  api.post<PostUserResponse>("/user", params, config?.headers);

export type GetUserConfig = FetchRequestConfig;
export const getUser = async ({ config }: GetUserConfig) => api.get<User>("/user/me", config?.headers);
