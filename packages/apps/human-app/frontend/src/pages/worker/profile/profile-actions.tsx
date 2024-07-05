import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { ProfileAction } from '@/pages/worker/profile/profile-action';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { useWalletConnect } from '@/hooks/use-wallet-connect';
import { ConnectWalletBtn } from '@/components/ui/connect-wallet-btn';
import { Button } from '@/components/ui/button';
import { routerPaths } from '@/router/router-paths';
import { RegisterAddressAction } from '@/pages/worker/profile/register-address-action';
import { RequireWalletConnect } from '@/auth-web3/require-wallet-connect';
import { WalletConnectDone } from '@/pages/worker/profile/wallet-connect-done';
import { StartKycButton } from '@/pages/worker/profile/start-kyc-btn';

export function ProfileActions() {
  const { user } = useAuthenticatedUser();
  const { t } = useTranslation();
  const { isConnected: isWalletConnected } = useWalletConnect();
  const emailVerified = user.status === 'ACTIVE';
  const kycApproved = user.kyc_status === 'APPROVED';

  if (!emailVerified) {
    return (
      <Navigate
        replace
        state={{ routerState: { email: user.email } }}
        to={routerPaths.worker.verifyEmail}
      />
    );
  }

  return (
    <Grid container flexDirection="column" gap="1rem">
      <Grid>
        <ProfileAction
          done={user.kyc_status === 'APPROVED' && emailVerified}
          doneLabel={t('worker.profile.kycCompleted')}
          toDoComponent={<StartKycButton />}
        />
      </Grid>
      <Grid>
        <ProfileAction
          done={
            Boolean(kycApproved && user.wallet_address) ||
            (kycApproved && isWalletConnected)
          }
          doneLabel={<WalletConnectDone />}
          toDoComponent={
            <ConnectWalletBtn
              disabled={user.kyc_status !== 'APPROVED'}
              fullWidth
              variant="contained"
            >
              {t('worker.profile.connectWallet')}
            </ConnectWalletBtn>
          }
        />
      </Grid>
      <Grid>
        {isWalletConnected && kycApproved ? (
          <RequireWalletConnect>
            <RegisterAddressAction kycApproved={kycApproved} />
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
