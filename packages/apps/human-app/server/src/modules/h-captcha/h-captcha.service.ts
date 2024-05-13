import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import {
  VerifyTokenCommand,
  VerifyTokenApiResponse, VerifyTokenResponse,
} from './model/verify-token.model';
import {
  DailyHmtSpentCommand,
  DailyHmtSpentResponse,
} from './model/daily-hmt-spent.model';
import {
  EnableLabelingCommand,
  EnableLabelingResponse,
} from './model/enable-labeling.model';
import { EnvironmentConfigService } from '../../common/config/environment-config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { UserStatsCommand, UserStatsApiResponse } from './model/user-sats.model';
import { Cache } from 'cache-manager';
import { HCaptchaLabelingGateway } from '../../integrations/h-captcha-labeling/h-captcha-labeling.gateway';
import { ReputationOracleGateway } from '../../integrations/reputation-oracle/reputation-oracle.gateway';

@Injectable()
export class HCaptchaService {
  BAD_REQUEST = 400;
  OK = 200;
  private readonly logger = new Logger(HCaptchaService.name);
  constructor(
    private configService: EnvironmentConfigService,
    private hCaptchaLabelingGateway: HCaptchaLabelingGateway,
    private reputationOracleGateway: ReputationOracleGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async verifyToken(command: VerifyTokenCommand): Promise<VerifyTokenResponse> {
    this.checkIfLabelingEnabledForAccount(command.hcaptchaSiteKey);
    const response =
      await this.hCaptchaLabelingGateway.sendTokenToVerify(command);
    if (response && response.success === true) {
      return new VerifyTokenResponse('CAPTCHA was verified successfully');
    }
    this.logger.error(this.createHCaptchaVerificationErrorMessage(response));
    throw new HttpException('Failed to verify h-captcha', 400);
  }
  private createHCaptchaVerificationErrorMessage(
    response: VerifyTokenApiResponse,
  ): string {
    let message = 'Failed to verify h-captcha token. ';
    if (response) {
      const errorCodes: any = response['error-codes'];
      if (errorCodes && Array.isArray(errorCodes)) {
        message += `Error: ${errorCodes}`;
      } else {
        message += `"error-codes" array is undefined. Response data: ${JSON.stringify(response)}`;
      }
    } else {
      message += 'Failed to process request';
    }
    return message;
  }
  async enableLabeling(
    command: EnableLabelingCommand,
  ): Promise<EnableLabelingResponse> {
    return this.reputationOracleGateway.approveUserAsLabeler(command);
  }

  async getDailyHmtSpent(
    command: DailyHmtSpentCommand,
  ): Promise<DailyHmtSpentResponse> {
    this.checkIfLabelingEnabledForAccount(command.hcaptchaSiteKey);
    const hmtKey = this.configService.dailyHmtSpentKey;
    let dailyHmtSpent =
      await this.cacheManager.get<DailyHmtSpentResponse>(hmtKey);
    if (!dailyHmtSpent) {
      dailyHmtSpent = await this.hCaptchaLabelingGateway.fetchDailyHmtSpent();
      this.cacheManager.set(hmtKey, dailyHmtSpent);
    }
    return dailyHmtSpent;
  }

  async getUserStats(command: UserStatsCommand): Promise<UserStatsApiResponse> {
    this.checkIfLabelingEnabledForAccount(command.hcaptchaSiteKey);
    let stats = await this.cacheManager.get<UserStatsApiResponse>(command.email);
    if (!stats) {
      stats = await this.hCaptchaLabelingGateway.fechUserStats(command.email);
      await this.cacheManager.set(command.email, stats);
    }
    return stats;
  }
  private checkIfLabelingEnabledForAccount(siteKey: string) {
    if (!siteKey) {
      throw new HttpException('Labeling is not enabled for this account', 400);
    }
  }
}
