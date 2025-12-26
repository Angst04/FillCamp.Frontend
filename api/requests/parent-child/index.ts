import { api } from "../../instance";

type GetParentChildConfig = FetchRequestConfig;
type GetParentChildResponse = {
  id: number;
  child: {
    id: number;
    telegram_id: number;
    first_name: string;
    last_name: string;
  };
  status: string;
  created_at: string;
};
export const getParentChildRequests = async ({ config }: GetParentChildConfig) =>
  api.get<GetParentChildResponse[]>("parent-child/requests", config?.headers);

type PostParentChildRequestAction = "approve" | "reject";
type PostParentChildRequestParams = {
  request_id: number;
  action: PostParentChildRequestAction;
};
export type PostParentChildConfig = FetchRequestConfig<PostParentChildRequestParams>;
export type PostParentChildResponse = GetParentChildResponse;
export const postParentChild = async ({ config, params }: PostParentChildConfig) =>
  api.post<PostParentChildResponse>(`parent-child/requests/${params.request_id}/action`, undefined, config?.headers, {
    action: params.action
  });
