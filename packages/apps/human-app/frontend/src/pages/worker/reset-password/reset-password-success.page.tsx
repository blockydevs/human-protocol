import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/ui/form-card';
import { useBackgroundColorStore } from '@/hooks/use-background-store';
import { routerPaths } from '@/router/router-paths';

export function ResetPasswordWorkerSuccessPage() {
  const { setGrayBackground } = useBackgroundColorStore();

  useEffect(() => {
    setGrayBackground();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- call this effect once
  }, []);

  return (
    <FormCard title={t('worker.resetPasswordSuccess.title')}>
      <Grid container gap="2rem">
        <Typography variant="body1">
          {t('worker.resetPasswordSuccess.description')}
        </Typography>
        <Button
          component={Link}
          fullWidth
          to={routerPaths.worker.signIn}
          type="submit"
          variant="contained"
        >
          {t('worker.resetPasswordSuccess.btn')}
        </Button>
      </Grid>
    </FormCard>
  );
}
