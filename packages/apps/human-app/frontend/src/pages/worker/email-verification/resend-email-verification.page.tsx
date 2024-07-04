/* eslint-disable camelcase -- ...*/
import { Grid, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { PageCard, PageCardLoader } from '@/components/ui/page-card';
import { env } from '@/shared/env';
import type { ResendEmailVerificationDto } from '@/api/servieces/worker/resend-email-verification';
import {
  resendEmailVerificationHcaptchaSchema,
  useResendEmailVerificationWorkerMutation,
  useResendEmailVerificationWorkerMutationState,
} from '@/api/servieces/worker/resend-email-verification';
import { Alert } from '@/components/ui/alert';
import { defaultErrorMessage } from '@/shared/helpers/default-error-message';
import { FormCaptcha } from '@/components/h-captcha';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/auth/use-auth';

export function ResendEmailVerificationWorkerPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const mutationState = useResendEmailVerificationWorkerMutationState();
  const { mutate: resendEmailVerificationMutation } =
    useResendEmailVerificationWorkerMutation();

  const methods = useForm<Pick<ResendEmailVerificationDto, 'h_captcha_token'>>({
    defaultValues: {
      h_captcha_token: '',
    },
    resolver: zodResolver(resendEmailVerificationHcaptchaSchema),
  });

  const handleResend = (
    data: Pick<ResendEmailVerificationDto, 'h_captcha_token'>
  ) => {
    resendEmailVerificationMutation({
      email: user?.email || '',
      h_captcha_token: data.h_captcha_token,
    });
  };

  if (mutationState?.status === 'pending') {
    return <PageCardLoader />;
  }

  return (
    <PageCard
      alert={
        mutationState?.status === 'error' ? (
          <Alert color="error" severity="error">
            {defaultErrorMessage(mutationState.error)}
          </Alert>
        ) : undefined
      }
      title={t('worker.sendEmailVerification.title')}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void methods.handleSubmit(handleResend)(event);
          }}
        >
          <Grid container gap="2rem" sx={{ paddingTop: '1rem' }}>
            <Typography>
              <Trans
                components={{
                  1: <Typography component="span" fontWeight={600} />,
                }}
                i18nKey="worker.sendEmailVerification.paragraph1"
                values={{ email: user?.email || '' }}
              />
            </Typography>
            <FormCaptcha error={mutationState?.error} name="h_captcha_token" />
            <Button fullWidth type="submit" variant="outlined">
              {t('worker.sendEmailVerification.btn')}
            </Button>
            <Typography variant="body1">
              <Trans
                components={{
                  1: <Typography component="span" variant="buttonMedium" />,
                  2: (
                    <Link
                      rel="noreferrer"
                      target="_blank"
                      to={env.VITE_HUMAN_PROTOCOL_HELP_URL}
                    />
                  ),
                }}
                i18nKey="worker.sendEmailVerification.paragraph2"
              />
            </Typography>
          </Grid>
        </form>
      </FormProvider>
    </PageCard>
  );
}
