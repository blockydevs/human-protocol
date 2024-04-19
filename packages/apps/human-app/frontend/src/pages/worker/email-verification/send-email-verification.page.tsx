import { Grid, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FormCard } from '@/components/ui/form-card';
import { useBackgroundColorStore } from '@/hooks/use-background-store';
import { sendResetLinkDtoSchema } from '@/api/servieces/worker/send-reset-link';
import { routerPaths } from '@/router/router-paths';
import { colorPalette } from '@/styles/color-palette';

function getEmail(locationState: unknown) {
  try {
    const result = sendResetLinkDtoSchema.parse(locationState);
    return result.email;
  } catch {
    return undefined;
  }
}

export function SendEmailVerificationWorkerPage() {
  const { t } = useTranslation();
  const { setGrayBackground } = useBackgroundColorStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setGrayBackground();
    const email = getEmail(location.state);
    if (!email) {
      navigate(routerPaths.homePage, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- call this effect once
  }, []);

  return (
    <FormCard title={t('worker.sendEmailVerification.title')}>
      <Grid container gap="2rem">
        <Typography>
          <Trans
            i18nKey="worker.sendEmailVerification.paragraph1"
            values={{ email: getEmail(location.state) }}
          >
            Strong <Typography variant="buttonMedium" />
          </Trans>
        </Typography>
        <Typography color={colorPalette.primary.light} variant="body1">
          {t('worker.sendEmailVerification.paragraph2')}
        </Typography>
        <Typography variant="body1">
          <Trans
            i18nKey="worker.sendEmailVerification.paragraph3"
            values={{ email: getEmail(location.state) }}
          >
            Strong
            <Typography variant="buttonMedium" />
            <Link to={routerPaths.homePage} />
          </Trans>
        </Typography>
      </Grid>
    </FormCard>
  );
}
