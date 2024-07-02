/* eslint-disable camelcase -- ...*/
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { jwtDecode } from 'jwt-decode';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { apiClient } from '@/api/api-client';
import { apiPaths } from '@/api/api-paths';
import { signInSuccessResponseSchema } from '@/api/servieces/worker/sign-in';
import { FetchError } from '@/api/fetcher';
import { browserAuthProvider } from '@/shared/helpers/browser-auth-provider';
import type { ResponseError } from '@/shared/types/global.type';
import { useGetAccessTokenMutation } from '@/api/servieces/common/get-access-token';

const kycSessionIdSchema = z.object({
  session_id: z.string(),
});

type KycError = 'emailNotVerified' | 'kycApproved';

export type KycSessionIdSuccessSchema = z.infer<typeof kycSessionIdSchema>;
type KycSessionIdMutationResult =
  | (KycSessionIdSuccessSchema & { error?: never })
  | { session_id?: never; error: KycError };

export function useKycSessionIdMutation(callbacks?: {
  onError?: (error: ResponseError) => void;
  onSuccess?: (response: KycSessionIdMutationResult) => void;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuthenticatedUser();
  const { mutateAsync: getAccessTokenMutation } = useGetAccessTokenMutation();
  return useMutation({
    mutationFn: async (): Promise<KycSessionIdMutationResult> => {
      const accessToken = browserAuthProvider.getAccessToken();
      if (!accessToken) {
        // unauthenticated
        browserAuthProvider.signOut();
        throw new Error();
      }
      const tokenPayload = jwtDecode(accessToken);
      const tokenExpired =
        (tokenPayload.exp || 0) < new Date().getTime() / 1000;

      const tokenOrSignInResponseData = tokenExpired
        ? await apiClient(apiPaths.worker.obtainAccessToken.path, {
            successSchema: signInSuccessResponseSchema,
            options: {
              method: 'POST',
              body: JSON.stringify({
                refresh_token: browserAuthProvider.getRefreshToken(),
              }),
            },
          })
        : accessToken;

      if (typeof tokenOrSignInResponseData !== 'string') {
        browserAuthProvider.signIn(
          tokenOrSignInResponseData,
          browserAuthProvider.authType
        );
      }

      try {
        const response = await apiClient(apiPaths.worker.kycSessionId.path, {
          successSchema: kycSessionIdSchema,
          options: {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${browserAuthProvider.getAccessToken()}`,
            }),
          },
        });
        return response;
      } catch (error) {
        // 401 - unauthenticated also means that email not verified
        // 400 - bad request also means that KYC already approved

        // normally if app receives 401 status code it tries to obtain
        // access token with refresh token, kycSessionIdMutation has to
        // implement its own flow to handle that case because 401 that
        // can be revived for "kyc/start" doesn't mean that JWT token expired
        if (error instanceof FetchError) {
          if (error.status === 401) {
            return { error: 'emailNotVerified' };
          }
          if (error.status === 400) {
            await getAccessTokenMutation('web2');
            return { error: 'kycApproved' };
          }
        }

        throw error;
      }
    },

    onError: (error) => {
      void queryClient.invalidateQueries();
      if (callbacks?.onError) callbacks.onError(error);
    },
    onSuccess: (response) => {
      void queryClient.invalidateQueries();
      if (callbacks?.onSuccess) callbacks.onSuccess(response);
    },
    mutationKey: ['kycSessionId', user.email],
  });
}
