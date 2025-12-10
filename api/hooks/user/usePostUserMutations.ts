import { postUser, PostUserConfig } from "@/api/requests/user";
import { useMutation } from "@tanstack/react-query";

export const usePostUserMutations = () => {
  return useMutation({
    mutationFn: ({ params, config }: PostUserConfig) =>
      postUser({
        params,
        config
      })
  });
};
