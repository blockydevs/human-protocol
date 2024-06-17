import { t } from 'i18next';
import { Button } from '@/components/ui/button';
import { useSetKycOnChainMutation } from '@/api/servieces/worker/set-kyc-on-chain';
import { useRegisterAddressOnChainNotifications } from '@/hooks/use-register-address-on-chain-notifications';

export function RegisterAddress({ disabled }: { disabled: boolean }) {
  const { onError, onSuccess } = useRegisterAddressOnChainNotifications();

  const { mutate, isPending } = useSetKycOnChainMutation({
    onError,
    onSuccess,
  });

  return (
    <Button
      disabled={disabled}
      fullWidth
      loading={isPending}
      onClick={mutate.bind(undefined, undefined)}
      variant="contained"
    >
      {t('worker.profile.addKYCInfoOnChain')}
    </Button>
  );
}
