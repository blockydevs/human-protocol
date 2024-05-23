/* eslint-disable camelcase -- ... */
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client';
import { apiPaths } from '@/api/api-paths';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';

export interface RegisterAddressPayload {
  chain_id?: number;
  address?: string;
}

const RegisterAddressSuccessSchema = z.unknown();

function registerAddress(data: RegisterAddressPayload) {
  return apiClient(apiPaths.worker.registerAddress.path, {
    authenticated: true,
    successSchema: RegisterAddressSuccessSchema,
    options: { method: 'POST', body: JSON.stringify(data) },
  });
}

export function useRegisterAddress() {
  const { chainId } = useWalletConnect();
  const { user } = useAuthenticatedUser();
  return useQuery({
    queryFn: () =>
      registerAddress({ chain_id: chainId, address: user.reputation_network }),
    queryKey: [chainId, user.reputation_network],
  });
}
