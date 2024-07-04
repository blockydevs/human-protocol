import { t } from 'i18next';
import { useEffect } from 'react';
import { useKycSessionIdMutation } from '@/api/servieces/worker/get-kyc-session-id';
import { useAuthenticatedUser } from '@/auth/use-authenticated-user';
import { Button } from '@/components/ui/button';
import { startSynapsKyc } from '@/pages/worker/profile/start-synaps-kyc';
import { useKycErrorNotifications } from '@/hooks/use-kyc-notification';

export function StartKycButton() {
  const { user } = useAuthenticatedUser();
  const onError = useKycErrorNotifications();
  const {
    data: kycSessionIdData,
    isPending: kycSessionIdIsPending,
    mutate: kycSessionIdMutation,
    status: kycSessionIdMutationStatus,
    error: kycSessionIdMutationError,
  } = useKycSessionIdMutation();

  const startKYC = () => {
    kycSessionIdMutation();
  };

  useEffect(() => {
    if (kycSessionIdMutationStatus === 'error') {
      onError(kycSessionIdMutationError);
    }

    if (
      kycSessionIdMutationStatus === 'success' &&
      kycSessionIdData.session_id
    ) {
      startSynapsKyc(kycSessionIdData.session_id);
    }
  }, [
    kycSessionIdData?.session_id,
    kycSessionIdMutationError,
    kycSessionIdMutationStatus,
    onError,
  ]);

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
