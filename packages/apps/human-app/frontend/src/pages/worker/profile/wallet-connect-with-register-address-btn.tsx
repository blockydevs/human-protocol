import { t } from 'i18next';
import { useEffect, useRef } from 'react';
import {
  PrepareSignatureType,
  usePrepareSignatureMutation,
} from '@/api/servieces/common/prepare-signature';
import { Button } from '@/components/ui/button';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { useRegisterAddress } from '@/api/servieces/worker/register-address';
import { useProtectedLayoutNotification } from '@/hooks/use-protected-layout-notifications';

export function WalletConnectWithRegisterAddressBtn() {
  const { setTopNotification } = useProtectedLayoutNotification();
  const setError = () => {
    setTopNotification({ content: t('errors.unknown'), type: 'warning' });
  };

  const { isConnected, openModal, address } = useWalletConnect();

  const {
    mutate: registerAddressMutation,
    isPending: isRegisterAddressMutationPending,
    isError: isRegisterAddressMutationError,
  } = useRegisterAddress(setError);

  const {
    mutate: prepareSignatureMutation,
    isPending: isPrepareSignatureMutationPending,
    isError: isPrepareSignatureMutationError,
  } = usePrepareSignatureMutation({
    onSuccess: (data) => {
      registerAddressMutation({ signatureData: data, address: address || '' });
    },
    onError: setError,
  });

  const wasConnectModalOpened = useRef(false);
  const buttonsDisabled =
    isPrepareSignatureMutationPending ||
    isRegisterAddressMutationPending ||
    isPrepareSignatureMutationError ||
    isRegisterAddressMutationError;

  useEffect(() => {
    if (isConnected && wasConnectModalOpened.current) {
      prepareSignatureMutation({
        address,
        type: PrepareSignatureType.RegisterAddress,
      });
    }
  }, [address, isConnected, prepareSignatureMutation]);

  const connectWallet = () => {
    wasConnectModalOpened.current = true;
    void openModal();
  };

  if (!isConnected) {
    return (
      <Button
        disabled={buttonsDisabled}
        fullWidth
        onClick={connectWallet}
        variant="contained"
      >
        {t('worker.profile.connectWallet')}
      </Button>
    );
  }

  return (
    <Button
      disabled={buttonsDisabled}
      fullWidth
      onClick={() => {
        prepareSignatureMutation({
          address,
          type: PrepareSignatureType.RegisterAddress,
        });
      }}
      variant="contained"
    >
      {t('worker.profile.connectWallet')}
    </Button>
  );
}
