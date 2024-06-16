import { useQueryClient } from '@tanstack/react-query';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import type { RegisterAddressSuccess } from '@/api/servieces/worker/register-address';
import { REGISTER_ADDRESS_QUERY_KEY } from '@/api/servieces/worker/register-address';

export function useRegisterAddressState() {
  const queryClient = useQueryClient();
  const { address } = useWalletConnect();
  const queryState = queryClient.getQueryState([
    REGISTER_ADDRESS_QUERY_KEY,
    address,
  ]);
  const queryData = queryClient.getQueryData<RegisterAddressSuccess>([
    REGISTER_ADDRESS_QUERY_KEY,
    address,
  ]);

  return {
    registerAddressQueryState: queryState,
    registerAddressQueryData: queryData,
  };
}
