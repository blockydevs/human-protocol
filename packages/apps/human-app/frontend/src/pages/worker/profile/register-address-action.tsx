import { t } from 'i18next';
import { Button } from '@/components/ui/button';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { ProfileAction } from '@/pages/worker/profile/profile-action';
import { RegisterAddress } from '@/pages/worker/profile/register-address-btn';
import { useGetOnChainRegisteredAddress } from '@/api/servieces/worker/get-on-chain-registered-address';

export function RegisterAddressAction({
  kycApproved,
}: {
  kycApproved: boolean;
}) {
  const {
    data: registerAddressData,
    isError: isRegisterAddressError,
    isPending: isRegisterAddressPending,
  } = useGetOnChainRegisteredAddress();
  const { isConnected } = useWalletConnect();

  if (isRegisterAddressPending) {
    return (
      <Button fullWidth loading>
        {t('worker.profile.addKYCInfoOnChain')}
      </Button>
    );
  }

  if (isRegisterAddressError) {
    return (
      <Button disabled fullWidth>
        {t('worker.profile.addKYCInfoOnChain')}
      </Button>
    );
  }

  return (
    <ProfileAction
      done={Boolean(registerAddressData.registeredAddressOnChain)}
      doneLabel={t('worker.profile.kycInfoOnChainAdded')}
      toDoComponent={
        <RegisterAddress disabled={!(isConnected && kycApproved)} />
      }
    />
  );
}
