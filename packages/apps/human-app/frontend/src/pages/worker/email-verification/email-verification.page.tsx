import { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { t } from 'i18next';
import Typography from '@mui/material/Typography';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FormCard } from '@/components/ui/form-card';
import { useBackgroundColorStore } from '@/hooks/use-background-store';
import { routerPaths } from '@/router/router-paths';
import { useVerifyEmailMutation } from '@/api/servieces/worker/email-verification';
import { Loader } from '@/components/ui/loader';
import { EmailVerificationWorkerErrorPage } from '@/pages/worker/email-verification/email-verification-error.page';
import { SuccessLabel } from '@/components/ui/success-label';

function getToken(searchParam: unknown) {
  try {
    const result = z
      .string()
      .transform((value, ctx) => {
        const token = value.split('=')[1];
        if (!token) {
          ctx.addIssue({
            fatal: true,
            code: z.ZodIssueCode.custom,
            message: 'error',
          });
        }

        return token;
      })
      .parse(searchParam);

    return result;
  } catch {
    return undefined;
  }
}

export function EmailVerificationWorkerPage() {
  const { setGrayBackground } = useBackgroundColorStore();
  const params = useLocation();
  const navigate = useNavigate();
  const {
    mutate: emailVerificationWorkerMutate,
    error: emailVerificationWorkerError,
    isError: isEmailVerificationWorkerError,
    isPending: isEmailVerificationWorkerPending,
    data: emailVerificationData,
  } = useVerifyEmailMutation();

  useEffect(() => {
    setGrayBackground();
    const token = getToken(params.search);

    if (!token) {
      navigate(routerPaths.homePage, { replace: true });
      return;
    }
    emailVerificationWorkerMutate({ token });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- call this effect once
  }, []);

  if (isEmailVerificationWorkerError) {
    return (
      <EmailVerificationWorkerErrorPage error={emailVerificationWorkerError} />
    );
  }

  if (isEmailVerificationWorkerPending || !emailVerificationData) {
    return (
      <FormCard>
        <Grid
          container
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Loader size={90} />
        </Grid>
      </FormCard>
    );
  }

  return (
    <FormCard
      title={<SuccessLabel>{t('worker.emailVerification.title')}</SuccessLabel>}
    >
      <Grid container gap="2rem">
        <Typography variant="body1">
          {t('worker.emailVerification.description')}
        </Typography>
        <Button
          component={Link}
          fullWidth
          to={routerPaths.worker.signIn}
          type="submit"
          variant="contained"
        >
          {t('worker.emailVerification.btn')}
        </Button>
      </Grid>
    </FormCard>
  );
}
