/* eslint-disable camelcase -- ... */
import { useMutation } from '@tanstack/react-query';
import type { JsonRpcSigner } from 'ethers';
import { useConnectedWallet } from '@/auth-web3/use-connected-wallet';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { ethKvStoreSetBulk } from '@/smart-contracts/EthKVStore/eth-kv-store-set-bulk';
import { getContractAddress } from '@/smart-contracts/get-contract-address';
import {
  PrepareSignatureType,
  prepareSignature,
} from '@/api/servieces/common/prepare-signature';
import { apiClient } from '@/api/api-client';
import { apiPaths } from '@/api/api-paths';
import {
  RegisterAddressSuccessSchema,
  type RegisterAddressSuccess,
} from '@/api/servieces/worker/register-address-on-chain';
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

export function useSetKycOnChainMutation(callbacks?: {
  onSuccess?: () => void;
  onError?: (e: ResponseError) => void;
}) {
  const { user } = useAuthenticatedUser();
  const { web3ProviderMutation, chainId, signMessage, address } =
    useConnectedWallet();

  const getSignedAddress = async (): Promise<RegisterAddressSuccess> => {
    const dataToSign = await prepareSignature({
      address,
      type: PrepareSignatureType.RegisterAddress,
    });
    const signature = await signMessage(JSON.stringify(dataToSign));

    return apiClient(apiPaths.worker.registerAddress.path, {
      authenticated: true,
      successSchema: RegisterAddressSuccessSchema,
      options: {
        method: 'POST',
        body: JSON.stringify({ address: user.address, signature }),
      },
    });
  };

  return useMutation({
    mutationFn: async () => {
      const signedAddress = await getSignedAddress();
      await registerAddressInKVStore({
        signed_address: signedAddress.signed_address || '',
        signer: web3ProviderMutation.data?.signer,
        oracleAddress: user.reputation_network,
        chainId,
      });
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    },
    onError: (error) => {
      if (callbacks?.onError) {
        callbacks.onError(error);
      }
    },
    mutationKey: [user.address],
  });
}
