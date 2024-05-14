import { HCaptchaLabelingEndpoints, ReputationOracleEndpoints } from '../../enums/reputation-oracle-endpoints';
import { HttpMethod } from '../../enums/http-method';

export const gatewayConfigServiceMock = {
  getConfig: jest.fn().mockReturnValue({
    url: 'https://expample.com',
    endpoints: {
      WORKER_SIGNUP: {
        endpoint: '/auth/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      OPERATOR_SIGNUP: {
        endpoint: '/auth/web3/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      WORKER_SIGNIN: {
        endpoint: '/auth/signin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      EMAIL_VERIFICATION: {
        endpoint: '/auth/email-verification',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      RESEND_EMAIL_VERIFICATION: {
        endpoint: '/auth/resend-email-verification',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      FORGOT_PASSWORD: {
        endpoint: '/auth/forgot-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      RESTORE_PASSWORD: {
        endpoint: '/auth/restore-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      PREPARE_SIGNATURE: {
        endpoint: '/user/prepare-signature',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      DISABLE_OPERATOR: {
        endpoint: '/user/disable-operator',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      KYC_PROCEDURE_START: {
        endpoint: '/kyc/start',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      ENABLE_LABELING: {
        endpoint: '/labeler/register',
        method: 'POST',
        params: { api_key: 'mock-api-key' },
      },
    },
  }),
};

export const hCaptchaGatewayConfigServiceMock = {
  getConfig: jest.fn().mockReturnValue({
    url: 'https://api.example.com',
    endpoints: {
      [HCaptchaLabelingEndpoints.TOKEN_VERIFY]: {
        method: HttpMethod.POST,
        endpoint: '/siteverify',
        headers: {},
        params: {},
      },
      [HCaptchaLabelingEndpoints.DAILY_HMT_SPENT]: {
        method: HttpMethod.GET,
        endpoint: '/requester/daily_hmt_spend',
        headers: {},
        params: { api_key: 'mock-api-key', actual: false },
      },
      [HCaptchaLabelingEndpoints.USER_STATS]: {
        method: HttpMethod.GET,
        endpoint: '/support/labeler/',
        headers: {},
        params: { api_key: 'mock-api-key' },
      },
    },
  }),
};
