/* eslint-disable camelcase -- ... */
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client';
import { apiPaths } from '@/api/api-paths';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import type { SignatureData } from '@/api/servieces/common/prepare-signature';

export interface RegisterAddressPayload {
  address: string;
}

// eslint-disable-next-line react-refresh/only-export-components -- ...
const RegisterAddressSuccessSchema = z.object({
  signed_address: z.string(),
});

export type RegisterAddressSuccess = z.infer<
  typeof RegisterAddressSuccessSchema
>;

export const getSignedAddress = (address: string, signature: string) => {
  return apiClient(apiPaths.worker.registerAddress.path, {
    authenticated: true,
    successSchema: RegisterAddressSuccessSchema,
    options: {
      method: 'POST',
      body: JSON.stringify({ address, signature }),
    },
  });
};

export const REGISTER_ADDRESS_QUERY_KEY = 'registerAddress';

export function useRegisterAddress(onError?: () => void) {
  const queryClient = useQueryClient();
  const { signMessage, address } = useWalletConnect();
  return useMutation({
    mutationFn: async (payload: {
      signatureData: SignatureData;
      address: string;
    }) => {
      const messageToSign = JSON.stringify(payload.signatureData);
      if (!signMessage) {
        throw new Error();
      }
      const signature = await signMessage(messageToSign);
      return getSignedAddress(payload.address, signature || '');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
    onError: async () => {
      if (onError) {
        onError();
      }
      await queryClient.invalidateQueries();
    },
    mutationKey: [REGISTER_ADDRESS_QUERY_KEY, address],
  });
}
