/* eslint-disable camelcase -- ... */
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/api-client';
import { apiPaths } from '@/api/api-paths';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { ethKVStoreGetKycData } from '@/smart-contracts/EthKVStore/eth-kv-store-get-kyc-data';
import { getContractAddress } from '@/smart-contracts/get-contract-address';
import { useConnectedWallet } from '@/auth-web3/use-connected-wallet';
import { useRegisterAddressState } from '@/hooks/use-register-address-state';
import {
  PrepareSignatureType,
  prepareSignature,
} from '@/api/servieces/common/prepare-signature';

export interface RegisterAddressPayload {
  address: string;
}

const RegisterAddressSuccessSchema = z.object({
  signed_address: z.string(),
});

export type RegisterAddressSuccess = z.infer<
  typeof RegisterAddressSuccessSchema
>;

export function useRegisterAddressOnChain() {
  const { user } = useAuthenticatedUser();
  const { web3ProviderMutation, address, chainId, signMessage } =
    useConnectedWallet();
  const { registerAddressQueryData } = useRegisterAddressState();

  const getSignedAddress = async (): Promise<RegisterAddressSuccess> => {
    if (registerAddressQueryData) {
      return registerAddressQueryData;
    }

    const dataToSign = await prepareSignature({
      address: user.address || address,
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

  return useQuery({
    queryFn: async () => {
      const signedAddress = await getSignedAddress();

      const contractAddress = getContractAddress({
        chainId,
        contractName: 'EthKVStore',
      });

      const registeredAddressOnChain = await ethKVStoreGetKycData({
        contractAddress,
        accountAddress: address,
        signed_address: signedAddress.signed_address,
        kycKey: `KYC-${user.reputation_network}`,
        signer: web3ProviderMutation.data?.signer,
        chainId,
      });

      return {
        signedAddress: signedAddress.signed_address,
        registeredAddressOnChain,
        kycRegisteredOnChain:
          signedAddress.signed_address === registeredAddressOnChain,
      };
    },
    retry: 0,
    refetchInterval: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryKey: [
      user.address,
      user.reputation_network,
      chainId,
      address,
      web3ProviderMutation.data?.signer,
    ],
  });
}
