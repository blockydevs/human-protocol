/* eslint-disable camelcase -- ... */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { JsonRpcSigner } from 'ethers';
import { z } from 'zod';
import { useConnectedWallet } from '@/auth-web3/use-connected-wallet';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { ethKvStoreSetBulk } from '@/smart-contracts/EthKVStore/eth-kv-store-set-bulk';
import { getContractAddress } from '@/smart-contracts/get-contract-address';
import type { ResponseError } from '@/shared/types/global.type';

async function registerAddressInKVStore({
  signed_address,
  oracleAddress,
  signer,
  chainId,
}: RegisterAddressSuccess & {
  oracleAddress: string;
  signer?: JsonRpcSigner;
  chainId: number;
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

const RegisterAddressSuccessSchema = z.object({
  signed_address: z.string(),
});

export type RegisterAddressSuccess = z.infer<
  typeof RegisterAddressSuccessSchema
>;

export const getSignedAddress = (_address: string, _signature: string) => {
  // TODO add endpoint that gets address that should be set in KVStore
  // return apiClient(apiPaths.worker.registerAddress.path, {
  //   authenticated: true,
  //   successSchema: RegisterAddressSuccessSchema,
  //   options: {
  //     method: 'POST',
  //     body: JSON.stringify({ address, signature }),
  //   },
  // });

  return { signed_address: 'mocked address' };
};

export function useRegisterAddress(callbacks?: {
  onSuccess?: (() => void) | (() => Promise<void>);
  onError?:
    | ((error: ResponseError) => void)
    | ((error: ResponseError) => Promise<void>);
}) {
  const queryClient = useQueryClient();
  const { user } = useAuthenticatedUser();

  const { web3ProviderMutation, chainId, address } = useConnectedWallet();
  return useMutation({
    mutationFn: async () => {
      // TODO add signature preparation
      // const dataToSign = await prepareSignature({
      //   address,
      //   type: PrepareSignatureType.RegisterAddress,
      // });
      // const messageToSign = JSON.stringify(dataToSign);
      // const signature = await signMessage(messageToSign);

      // if (!signature) {
      //   throw new Error(t('errors.unknown'));
      // }

      const signedAddress = getSignedAddress(address, 'signature');

      await registerAddressInKVStore({
        signed_address: signedAddress.signed_address,
        signer: web3ProviderMutation.data?.signer,
        oracleAddress: user.reputation_network,
        chainId,
      });
    },
    onSuccess: async () => {
      if (callbacks?.onSuccess) {
        await callbacks.onSuccess();
      }
      await queryClient.invalidateQueries();
    },
    onError: async (error) => {
      if (callbacks?.onError) {
        await callbacks.onError(error);
      }
      await queryClient.invalidateQueries();
    },
    mutationKey: [user.address],
  });
}
