import { api } from "@/api/instance";

export type PostUserConfig = FetchRequestConfig<PostUserRequest>;
export const postUser = async ({ params, config }: PostUserConfig) =>
  api.post<PostUserResponse>("/user", params, config?.headers);
