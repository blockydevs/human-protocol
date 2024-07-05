import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { Button } from '@/components/ui/button';
import { routerPaths } from '@/router/router-paths';
import { WalletConnectDone } from '@/pages/worker/profile/wallet-connect-done';
import { StartKycButton } from '@/pages/worker/profile/start-kyc-btn';
import { RegisterAddressBtn } from '@/pages/worker/profile/register-address-btn';
import { DoneLabel } from '@/pages/worker/profile/done-label';
import { useRegisterAddressNotifications } from '@/hooks/use-register-address-notifications';
import { useRegisterAddressMutation } from '@/api/servieces/worker/use-register-address';
import { useGetSignedAddress } from '@/api/servieces/worker/get-signed-address';
import { RequireWalletConnect } from '@/auth-web3/require-wallet-connect';
import { RegisterAddressOnChainButton } from '@/pages/worker/profile/register-address-on-chain-btn';

export function ProfileActions() {
  useGetSignedAddress();
  const {
    isConnected: isWalletConnected,
    address,
    openModal,
  } = useWalletConnect();
  const { onSuccess, onError } = useRegisterAddressNotifications();
  const {
    mutate: registerAddressMutation,
    isPending: isRegisterAddressMutationPending,
  } = useRegisterAddressMutation({
    onError,
    onSuccess,
  });
  const modalWasOpened = useRef(false);
  useEffect(() => {
    if (isWalletConnected && modalWasOpened.current) {
      registerAddressMutation();
    }
  }, [address, isWalletConnected, registerAddressMutation]);
  const navigation = useNavigate();
  const { user } = useAuthenticatedUser();
  const { t } = useTranslation();
  const emailVerified = user.status === 'ACTIVE';
  const kycApproved = user.kyc_status === 'APPROVED';
  const isWalletConnectedAndAddressRegistered =
    kycApproved && (user.address || isWalletConnected);
  const isWalletConnectedAndAddressNotRegistered =
    kycApproved && !user.address && isWalletConnected;

  return (
    <Grid container flexDirection="column" gap="1rem">
      <Grid>
        {!emailVerified && (
          <Button
            fullWidth
            onClick={() => {
              navigation(routerPaths.worker.resendEmailVerification);
            }}
            variant="contained"
          >
            {t('worker.profile.confirmEmail')}
          </Button>
        )}
      </Grid>
      <Grid>
        {kycApproved && emailVerified ? (
          <DoneLabel>{t('worker.profile.kycCompleted')}</DoneLabel>
        ) : (
          <StartKycButton />
        )}
      </Grid>
      <Grid>
        {isWalletConnectedAndAddressRegistered ? (
          <DoneLabel>
            <WalletConnectDone />
          </DoneLabel>
        ) : (
          <Button
            disabled={user.kyc_status !== 'APPROVED'}
            fullWidth
            loading={isRegisterAddressMutationPending}
            onClick={() => {
              modalWasOpened.current = true;
              void openModal();
            }}
            variant="contained"
          >
            {t('components.wallet.connectBtn.connect')}
          </Button>
        )}
      </Grid>
      {isWalletConnectedAndAddressNotRegistered ? (
        <Grid>
          <RegisterAddressBtn />
        </Grid>
      ) : null}
      <Grid>
        {isWalletConnected && kycApproved ? (
          <RequireWalletConnect>
            <RegisterAddressOnChainButton />
          </RequireWalletConnect>
        ) : (
          <Button disabled fullWidth>
            {t('worker.profile.addKYCInfoOnChain')}
          </Button>
        )}
      </Grid>
    </Grid>
  );
}
