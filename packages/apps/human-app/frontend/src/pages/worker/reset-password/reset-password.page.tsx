import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Grid from '@mui/material/Grid';
import { z } from 'zod';
import Typography from '@mui/material/Typography';
import { t } from 'i18next';
import omit from 'lodash/omit';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Password } from '@/components/data-entry/password/password';
import { FormCard } from '@/components/ui/form-card';
import {
  password8Chars,
  passwordLowercase,
  passwordNumeric,
  passwordSpecialCharacter,
  passwordUppercase,
} from '@/shared/helpers/regex';
import type { PasswordCheck } from '@/components/data-entry/password/password-check-label';
import { useBackgroundColorStore } from '@/hooks/use-background-store';
import { routerPaths } from '@/router/router-paths';
import type { ResetPasswordDto } from '@/api/servieces/worker/reset-password';
import {
  resetPasswordDtoSchema,
  useResetPasswordMutation,
} from '@/api/servieces/worker/reset-password';
import { Alert } from '@/components/ui/alert';
import { defaultErrorMessage } from '@/shared/helpers/default-error-message';

const passwordChecks: PasswordCheck[] = [
  {
    requirementsLabel: t('validation.password8Chars'),
    schema: z.string().regex(password8Chars),
  },
  {
    requirementsLabel: t('validation.passwordUppercase'),
    schema: z.string().regex(passwordUppercase),
  },
  {
    requirementsLabel: t('validation.passwordLowercase'),
    schema: z.string().regex(passwordLowercase),
  },
  {
    requirementsLabel: t('validation.passwordNumeric'),
    schema: z.string().regex(passwordNumeric),
  },
  {
    requirementsLabel: t('validation.passwordSpecialCharacter'),
    schema: z.string().regex(passwordSpecialCharacter),
  },
];

export function ResetPasswordWorkerPage() {
  const { setGrayBackground } = useBackgroundColorStore();
  const { token } = useParams();

  useEffect(() => {
    setGrayBackground();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- call this effect once
  }, []);

  const methods = useForm<ResetPasswordDto>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    resolver: zodResolver(resetPasswordDtoSchema),
  });

  const {
    mutate: resetPasswordWorkerMutate,
    error: resetPasswordWorkerError,
    isError: isResetPasswordWorkerError,
    isPending: isResetPasswordWorkerPending,
  } = useResetPasswordMutation();

  const handleWorkerResetPassword = (data: ResetPasswordDto) => {
    resetPasswordWorkerMutate(
      omit({ ...data, token: token || '' }, ['confirmPassword'])
    );
  };

  return (
    <FormCard
      alert={
        isResetPasswordWorkerError ? (
          <Alert color="error" severity="error" sx={{ width: '100%' }}>
            {defaultErrorMessage(resetPasswordWorkerError)}
          </Alert>
        ) : undefined
      }
      backArrowPath={routerPaths.homePage}
      title={t('worker.resetPassword.title')}
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void methods.handleSubmit(handleWorkerResetPassword)(event);
          }}
        >
          <Grid container gap="2rem">
            <Typography variant="body1">
              {t('worker.resetPassword.description')}
            </Typography>
            <Password
              label={t('worker.resetPassword.fields.createNewPassword')}
              name="password"
              passwordCheckHeader="Password must contain at least:"
              passwordChecks={passwordChecks}
            />
            <Password
              label={t('worker.resetPassword.fields.confirm')}
              name="confirmPassword"
            />
            <Button
              disabled={isResetPasswordWorkerPending}
              fullWidth
              type="submit"
              variant="contained"
            >
              {t('worker.signUpForm.submitBtn')}
            </Button>
          </Grid>
        </form>
      </FormProvider>
    </FormCard>
  );
}
