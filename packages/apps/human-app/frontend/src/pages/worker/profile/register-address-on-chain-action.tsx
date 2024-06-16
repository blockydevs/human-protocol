import { t } from 'i18next';
import { useEffect } from 'react';
import { useRegisterAddressOnChain } from '@/api/servieces/worker/register-address-on-chain';
import { Button } from '@/components/ui/button';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { ProfileAction } from '@/pages/worker/profile/profile-action';
import { RegisterAddress } from '@/pages/worker/profile/register-address-on-chain-btn';
import { useProtectedLayoutNotification } from '@/hooks/use-protected-layout-notifications';

export function RegisterAddressAction({
  kycApproved,
}: {
  kycApproved: boolean;
}) {
  const { setTopNotification, closeNotification } =
    useProtectedLayoutNotification();

  const {
    data: registerAddressOnChainData,
    isError: isRegisterAddressOnChainError,
    isPending: isRegisterAddressOnChainPending,
    status: registerAddressOnChainStatus,
  } = useRegisterAddressOnChain();

  const { isConnected } = useWalletConnect();

  useEffect(() => {
    if (
      !registerAddressOnChainData?.kycRegisteredOnChain &&
      registerAddressOnChainStatus === 'success'
    ) {
      setTopNotification({
        content: t('worker.profile.topNotifications.noKYCOnChain'),
        type: 'warning',
      });

      return;
    }

    if (
      registerAddressOnChainData?.kycRegisteredOnChain &&
      registerAddressOnChainStatus === 'success'
    ) {
      closeNotification();

      return;
    }

    if (registerAddressOnChainStatus === 'error') {
      setTopNotification({
        content: t('errors.unknown'),
        type: 'warning',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ...
  }, [
    registerAddressOnChainData?.kycRegisteredOnChain,
    registerAddressOnChainStatus,
  ]);

  if (isRegisterAddressOnChainPending) {
    return (
      <Button fullWidth loading>
        {t('worker.profile.addKYCInfoOnChain')}
      </Button>
    );
  }

  if (isRegisterAddressOnChainError) {
    return (
      <Button disabled fullWidth>
        {t('worker.profile.addKYCInfoOnChain')}
      </Button>
    );
  }

  return (
    <ProfileAction
      done={Boolean(registerAddressOnChainData.kycRegisteredOnChain)}
      doneLabel={t('worker.profile.kycInfoOnChainAdded')}
      toDoComponent={
        <RegisterAddress
          disabled={!(isConnected && kycApproved)}
          signed_address={registerAddressOnChainData.signedAddress || ''}
        />
      }
    />
  );
}
