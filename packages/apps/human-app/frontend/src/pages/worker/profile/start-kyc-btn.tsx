import { t } from 'i18next';
import { useKycSessionIdMutation } from '@/api/servieces/worker/get-kyc-session-id';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { Button } from '@/components/ui/button';
import { startSynapsKyc } from '@/pages/worker/profile/start-synaps-kyc';
import { useKycErrorNotifications } from '@/hooks/use-kyc-notification';

export function StartKycButton() {
  const { user } = useAuthenticatedUser();
  const onError = useKycErrorNotifications();
  const { isPending: kycSessionIdIsPending, mutate: kycSessionIdMutation } =
    useKycSessionIdMutation({
      onError,
      onSuccess: (response) => {
        if (response.session_id) {
          startSynapsKyc(response.session_id);
        }
      },
    });

  const startKYC = () => {
    kycSessionIdMutation();
  };

  return (
    <Button
      disabled={user.status !== 'ACTIVE'}
      fullWidth
      loading={kycSessionIdIsPending}
      onClick={startKYC}
      variant="contained"
    >
      {t('worker.profile.completeKYC')}
    </Button>
  );
}
