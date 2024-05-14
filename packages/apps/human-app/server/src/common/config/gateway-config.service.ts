import { Injectable } from '@nestjs/common';
import { ExternalApiName } from '../enums/external-api-name';
import {
  HCaptchaLabelingEndpoints,
  ReputationOracleEndpoints,
} from '../enums/reputation-oracle-endpoints';
import {
  GatewayConfig,
  GatewayEndpointConfig,
  Gateways,
} from '../interfaces/endpoint.interface';
import { EnvironmentConfigService } from './environment-config.service';
import { HttpMethod } from '../enums/http-method';

@Injectable()
export class GatewayConfigService {
  JSON_HEADER = {
    'Content-Type': 'application/json',
  };
  HCAPTCHA_API_KEY: Record<string, string> = {
    api_key: this.envConfig.hcaptchaLabelingApiKey,
  };
  constructor(private envConfig: EnvironmentConfigService) {}

  private getGatewaysConfig(): Gateways {
    return {
      gateways: {
        [ExternalApiName.REPUTATION_ORACLE]: {
          url: this.envConfig.reputationOracleUrl,
          endpoints: {
            [ReputationOracleEndpoints.WORKER_SIGNUP]: {
              endpoint: '/auth/signup',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },
            [ReputationOracleEndpoints.OPERATOR_SIGNUP]: {
              endpoint: '/auth/web3/signup',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },
            [ReputationOracleEndpoints.WORKER_SIGNIN]: {
              endpoint: '/auth/signin',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },
            [ReputationOracleEndpoints.EMAIL_VERIFICATION]: {
              endpoint: '/auth/email-verification',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },
            [ReputationOracleEndpoints.RESEND_EMAIL_VERIFICATION]: {
              endpoint: '/auth/resend-email-verification',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },
            [ReputationOracleEndpoints.FORGOT_PASSWORD]: {
              endpoint: '/auth/forgot-password',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },
            [ReputationOracleEndpoints.RESTORE_PASSWORD]: {
              endpoint: '/auth/restore-password',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },
            [ReputationOracleEndpoints.PREPARE_SIGNATURE]: {
              endpoint: '/user/prepare-signature',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },
            [ReputationOracleEndpoints.DISABLE_OPERATOR]: {
              endpoint: '/user/disable-operator',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },
            [ReputationOracleEndpoints.KYC_PROCEDURE_START]: {
              endpoint: '/kyc/start',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },
            [ReputationOracleEndpoints.ENABLE_LABELING]: {
              endpoint: '/labeler/register',
              method: HttpMethod.POST,
              params: this.HCAPTCHA_API_KEY,
            },
            [ReputationOracleEndpoints.OPERATOR_SIGNIN]: {
              endpoint: '/auth/web3/signin',
              method: HttpMethod.POST,
              headers: this.JSON_HEADER,
            },

          } as Record<ReputationOracleEndpoints, GatewayEndpointConfig>,
        },
        [ExternalApiName.HCAPTCHA_LABELING]: {
          url: this.envConfig.hcaptchaLabelingApiUrl,
          endpoints: {
            [HCaptchaLabelingEndpoints.USER_STATS]: {
              endpoint: '/support/labeler/', // email to append as url param
              method: HttpMethod.GET,
              params: this.HCAPTCHA_API_KEY,
            },
            [HCaptchaLabelingEndpoints.DAILY_HMT_SPENT]: {
              endpoint: '/requester/daily_hmt_spend',
              method: HttpMethod.GET,
              params: {
                ...this.HCAPTCHA_API_KEY,
                actual: false,
              },
            },
            [HCaptchaLabelingEndpoints.TOKEN_VERIFY]: {
              endpoint: '/siteverify',
              method: HttpMethod.POST,
              // params in this method are dynamic
            },
          } as Record<HCaptchaLabelingEndpoints, GatewayEndpointConfig>,
        },
      },
    };
  }
  getConfig(gateway: ExternalApiName): GatewayConfig {
    const config = this.getGatewaysConfig().gateways[gateway];
    return config;
  }
}
