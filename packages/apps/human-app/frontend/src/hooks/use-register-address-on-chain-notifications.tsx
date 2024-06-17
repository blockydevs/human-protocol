import { useProtectedLayoutNotification } from '@/hooks/use-protected-layout-notifications';
import { defaultErrorMessage } from '@/shared/helpers/default-error-message';
import type { ResponseError } from '@/shared/types/global.type';

export function useRegisterAddressOnChainNotifications() {
  const { setTopNotification, closeNotification } =
    useProtectedLayoutNotification();

  return {
    onError: (error: ResponseError) => {
      setTopNotification({
        type: 'warning',
        content: defaultErrorMessage(error),
      });
    },
    onSuccess: () => {
      closeNotification();
    },
  };
}
