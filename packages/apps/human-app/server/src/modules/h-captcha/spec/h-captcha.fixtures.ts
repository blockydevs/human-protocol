import { JwtUserData } from '../../../common/interfaces/jwt-token.model';
import {
  VerifyTokenApiResponse,
  VerifyTokenCommand,
  VerifyTokenData,
  VerifyTokenDto,
} from '../model/verify-token.model';
import {
  DailyHmtSpentCommand,
  DailyHmtSpentResponse,
} from '../model/daily-hmt-spent.model';
import {
  UserDropoffData,
  UserStatsApiResponse,
  UserStatsCommand,
  UserStatsResponse,
} from '../model/user-sats.model';
import { EnableLabelingCommand, EnableLabelingData, EnableLabelingResponse } from '../model/enable-labeling.model';
import { AutoMap } from '@automapper/classes';
const EMAIL = 'some_email@example.com';
const ID = 'jwt_token_id';
const COUNTRY = 'poland';
const ETH_ADDR = '0x12345';
const H_CAPTCHA_SITE_KEY = 'some_h_captcha_site_key';
const TOKEN_TO_VERIFY = 'some_hcaptcha_token';
const POLYGON_WALLET_ADDR = '0x98765';
const DAILY_HMT_SPENT = 100;
const SOLVED = 10;
const SERVED = 20;
const VERIFIED = 5;
const BALANCE = 50;
const LANGUAGE = 'en';
const DROPOFF_DATA_1 = { date: '2021-01-01', value: 10 };
const DROPOFF_DATA_2 = { date: '2021-01-02', value: 20 };
const DROPOFF_DATA_3 = { date: '2021-01-03', value: 30 };
const SUCCESSFULLY_ENABLED = 'Enabled labeling for this account successfully';
export const jwtUserDataFixture: JwtUserData = {
  _id: ID,
  country: COUNTRY,
  eth_addr: ETH_ADDR,
  email: EMAIL,
  hcaptchaSiteKey: H_CAPTCHA_SITE_KEY,
  polygonWalletAddr: POLYGON_WALLET_ADDR,
  isKYCed: true,
};

export const hCaptchaUserStatsCommandFixture: UserStatsCommand = {
  email: EMAIL,
  hcaptchaSiteKey: H_CAPTCHA_SITE_KEY,
};

export const enableLabelingCommandFixture: EnableLabelingCommand = {
  _id: ID,
  country: COUNTRY,
  email: EMAIL,
  isKYCed: true,
  polygonWalletAddr: POLYGON_WALLET_ADDR,
  hcaptchaSiteKey: H_CAPTCHA_SITE_KEY,
};

export const verifyTokenDtoFixture: VerifyTokenDto = {
  hcaptchaToken: TOKEN_TO_VERIFY,
};

export const verifyTokenCommandFixture: VerifyTokenCommand = {
  hcaptchaToken: TOKEN_TO_VERIFY,
  hcaptchaSiteKey: H_CAPTCHA_SITE_KEY,
  polygonWalletAddr: POLYGON_WALLET_ADDR,
};

export const verifyTokenDataFixture: VerifyTokenData = {
  secret: POLYGON_WALLET_ADDR,
  sitekey: H_CAPTCHA_SITE_KEY,
  response: TOKEN_TO_VERIFY,
};

export const dailyHmtSpentCommandFixture: DailyHmtSpentCommand = {
  hcaptchaSiteKey: H_CAPTCHA_SITE_KEY,
};

export const successfulVerifyTokenApiResponseFixture: VerifyTokenApiResponse = {
  success: true,
};

export const unsuccessfulVerifyTokenApiResponseWithErrorCodesFixture: VerifyTokenApiResponse =
  {
    success: false,
    'error-codes': ['invalid-input-response', 'timeout-or-duplicate'],
  };

export const unsuccessfulVerifyTokenApiResponseWithoutErrorCodesFixture: VerifyTokenApiResponse =
  {
    success: false,
  };

export const unsuccessfulVerifyTokenApiResponseWithUndefinedErrorCodesFixture: VerifyTokenApiResponse =
  {
    success: false,
    'error-codes': undefined,
  };

export const dailyHmtSpentResponseFixture: DailyHmtSpentResponse = {
  spend: DAILY_HMT_SPENT,
};

export const errorMessagesFixture = {
  withErrorCodes:
    'Failed to verify h-captcha token. Error: invalid-input-response,timeout-or-duplicate',
  withoutErrorCodes:
    'Failed to verify h-captcha token. "error-codes" array is undefined. Response data: {}',
  withUndefinedErrorCodes:
    'Failed to verify h-captcha token. "error-codes" array is undefined. Response data: {"success":false}',
};
export const dropoffDataFixture: UserDropoffData[] = [
  DROPOFF_DATA_1,
  DROPOFF_DATA_2,
  DROPOFF_DATA_3,
];

export const userStatsApiResponseFixture: UserStatsApiResponse = {
  solved: SOLVED,
  served: SERVED,
  verified: VERIFIED,
  balance: BALANCE,
  dropoff_data: dropoffDataFixture,
};

export const userStatsResponseFixture: UserStatsResponse = {
  solved: SOLVED,
  served: SERVED,
  verified: VERIFIED,
  balance: BALANCE,
  currentDateStats: DROPOFF_DATA_3,
};

export const userStatsCommandFixture: UserStatsCommand = {
  email: EMAIL,
  hcaptchaSiteKey: H_CAPTCHA_SITE_KEY,
};
export const enableLabelingDataFixture: EnableLabelingData = {
  email: EMAIL,
  country: COUNTRY,
  isKYCed: true,
  _id: ID,
  polygonWalletAddr: POLYGON_WALLET_ADDR,
  hcaptchaSiteKey: H_CAPTCHA_SITE_KEY,
  language: LANGUAGE,
}
export const enableLabelingResponseFixture: EnableLabelingResponse = {
  message: SUCCESSFULLY_ENABLED,
};
