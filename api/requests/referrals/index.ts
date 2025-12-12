import { api } from "@/api/instance";

type GetReferralsConfig = FetchRequestConfig;
export const getReferrals = async ({ config }: GetReferralsConfig) =>
  api.get<ReferralsResponse>("/referrals/me", config?.headers);
