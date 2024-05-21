import { Injectable } from '@nestjs/common';
import {
  VerifyTokenCommand,
  VerifyTokenApiResponse,
  VerifyTokenData,
} from '../../modules/h-captcha/model/verify-token.model';
import {
  GatewayConfig,
  GatewayEndpointConfig,
} from '../../common/interfaces/endpoint.interface';
import { HttpService } from '@nestjs/axios';
import { GatewayConfigService } from '../../common/config/gateway-config.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ExternalApiName } from '../../common/enums/external-api-name';
import {
  HCaptchaLabelingEndpoints,
  ReputationOracleEndpoints,
} from '../../common/enums/reputation-oracle-endpoints';
import { RequestDataType } from '../reputation-oracle/reputation-oracle.interface';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import {
  UserStatsApiResponse,
  UserStatsResponse,
} from '../../modules/h-captcha/model/user-stats.model';
import { toCleanObjParams } from '../../common/utils/gateway-common.utils';
import { DailyHmtSpentResponse } from '../../modules/h-captcha/model/daily-hmt-spent.model';

@Injectable()
export class HCaptchaLabelingGateway {
  private readonly gatewayConfig: GatewayConfig;
  constructor(
    private httpService: HttpService,
    gatewayConfigService: GatewayConfigService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {
    this.gatewayConfig = gatewayConfigService.getConfig(
      ExternalApiName.HCAPTCHA_LABELING,
    );
  }
  private getEndpointOptions(
    endpointName: HCaptchaLabelingEndpoints | ReputationOracleEndpoints,
    data?: RequestDataType,
    token?: string,
  ) {
    const endpointConfig: GatewayEndpointConfig =
      this.gatewayConfig.endpoints[endpointName];
    const authHeader = token ? { Authorization: token } : {};
    return {
      method: endpointConfig.method,
      url: `${this.gatewayConfig.url}${endpointConfig.endpoint}`,
      headers: {
        ...authHeader,
        ...endpointConfig.headers,
      },
      params: {
        ...endpointConfig.params,
      },
      data: data,
    } as AxiosRequestConfig;
  }
  private async handleRequestToHCaptchaLabelingApi<T>(
    options: AxiosRequestConfig,
  ): Promise<T> {
    const response = await lastValueFrom(this.httpService.request(options));
    return response.data;
  }
  async sendTokenToVerify(
    command: VerifyTokenCommand,
  ): Promise<VerifyTokenApiResponse> {
    const options = this.getEndpointOptions(
      HCaptchaLabelingEndpoints.TOKEN_VERIFY,
    );
    const data = this.mapper.map(command, VerifyTokenCommand, VerifyTokenData);
    options.params = toCleanObjParams(data, options.params);
    return this.handleRequestToHCaptchaLabelingApi<VerifyTokenApiResponse>(
      options,
    );
  }
  async fetchDailyHmtSpent() {
    const options = this.getEndpointOptions(
      HCaptchaLabelingEndpoints.DAILY_HMT_SPENT,
    );
    return this.handleRequestToHCaptchaLabelingApi<DailyHmtSpentResponse>(
      options,
    );
  }

  async fetchUserStats(email: string): Promise<UserStatsResponse> {
    const options = this.getEndpointOptions(
      HCaptchaLabelingEndpoints.USER_STATS,
    );
    options.url += email;
    const response =
      await this.handleRequestToHCaptchaLabelingApi<UserStatsApiResponse>(
        options,
      );
    return this.mapper.map(response, UserStatsApiResponse, UserStatsResponse);
  }
}
