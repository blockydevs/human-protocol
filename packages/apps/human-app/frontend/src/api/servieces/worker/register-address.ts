/* eslint-disable camelcase -- ... */
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import type { JsonRpcSigner } from 'ethers';
import { apiClient } from '@/api/api-client';
import { apiPaths } from '@/api/api-paths';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { ethKvStoreSetBulk } from '@/smart-contracts/EthKVStore/eth-kv-store-set-bulk';
import { getContractAddress } from '@/smart-contracts/get-contract-address';

export interface RegisterAddressPayload {
  address?: string;
}

const RegisterAddressSuccessSchema = z.object({
  signed_address: z.string(),
});

type RegisterAddressSuccess = z.infer<typeof RegisterAddressSuccessSchema>;

function registerAddress(data: RegisterAddressPayload) {
  return apiClient(apiPaths.worker.registerAddress.path, {
    authenticated: true,
    successSchema: RegisterAddressSuccessSchema,
    options: { method: 'POST', body: JSON.stringify(data) },
  });
}

async function registerAddressInKVStore({
  signed_address,
  oracleAddress,
  signer,
  chainId = 80002,
}: RegisterAddressSuccess & {
  oracleAddress: string;
  signer?: JsonRpcSigner;
  chainId?: number;
}) {
  const contractAddress = getContractAddress({
    chainId,
    contractName: 'EthKVStore',
  });

  await ethKvStoreSetBulk({
    keys: [`KYC-${oracleAddress}`],
    values: [signed_address],
    signer,
    chainId,
    contractAddress,
  });
}

export function useRegisterAddress() {
  const { user } = useAuthenticatedUser();
  const { web3ProviderMutation, chainId } = useWalletConnect();
  return useMutation({
    mutationFn: async () => {
      const response = await registerAddress({ address: user.address || '' });
      await registerAddressInKVStore({
        signed_address: response.signed_address,
        signer: web3ProviderMutation.data?.signer,
        oracleAddress: user.reputation_network,
        chainId,
      });
    },
    mutationKey: [user.address],
  });
}
