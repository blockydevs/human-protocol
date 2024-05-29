import { t } from 'i18next';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRegisterAddress } from '@/api/servieces/worker/register-address';
import { useProtectedLayoutNotification } from '@/hooks/use-protected-layout-notifications';
import { defaultErrorMessage } from '@/shared/helpers/default-error-message';

export function RegisterAddress({ disabled }: { disabled: boolean }) {
  const { closeNotification, setTopNotification } =
    useProtectedLayoutNotification();
  const { mutate, isPending, error, status } = useRegisterAddress();

  useEffect(() => {
    if (status === 'success') {
      closeNotification();
      return;
    }
    if (status === 'error') {
      setTopNotification({
        type: 'warning',
        content: defaultErrorMessage(error),
      });
    }
  }, [closeNotification, error, setTopNotification, status]);

  return (
    <Button
      disabled={disabled}
      fullWidth
      loading={isPending}
      onClick={() => {
        mutate();
      }}
      variant="contained"
    >
      {t('worker.profile.addKYCInfoOnChain')}
    </Button>
  );
}
