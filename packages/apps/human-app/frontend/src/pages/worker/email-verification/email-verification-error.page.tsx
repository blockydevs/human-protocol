import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useBackgroundColorStore } from '@/hooks/use-background-store';
import { defaultErrorMessage } from '@/shared/helpers/default-error-message';
import { Alert } from '@/components/ui/alert';

export function EmailVerificationWorkerErrorPage(props: { error: unknown }) {
  const { setGrayBackground } = useBackgroundColorStore();

  useEffect(() => {
    setGrayBackground();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- call this effect once
  }, []);

  return (
    <Grid container sx={{ justifyContent: 'center', alignItems: 'center' }}>
      <Alert color="error" severity="error">
        {defaultErrorMessage(props.error)}
      </Alert>
    </Grid>
  );
}
