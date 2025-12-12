import { api } from "@/api/instance";

export type GetProfileConfig = FetchRequestConfig;
export const getProfile = async ({ config }: GetProfileConfig) =>
  api.get<GetProfileResponse>("/profile/me", config?.headers);
