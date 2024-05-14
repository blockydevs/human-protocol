import { Test, TestingModule } from '@nestjs/testing';
import { HCaptchaLabelingGateway } from '../h-captcha-labeling.gateway';
import { HttpService } from '@nestjs/axios';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { of } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { HCaptchaLabelingEndpoints } from '../../../common/enums/reputation-oracle-endpoints';
import { HttpMethod } from '../../../common/enums/http-method';
import { HCaptchaLabelingMapperProfile } from '../h-captcha-labeling.mapper.profile';
import { GatewayConfigService } from '../../../common/config/gateway-config.service';
import { EnvironmentConfigService } from '../../../common/config/environment-config.service';
import { toCleanObjParams } from '../../../common/utils/gateway-common.utils';
import {
  dailyHmtSpentResponseFixture,
  successfulVerifyTokenApiResponseFixture,
  userStatsApiResponseFixture,
  userStatsResponseFixture,
  verifyTokenCommandFixture,
  verifyTokenDataFixture,
} from '../../../modules/h-captcha/spec/h-captcha.fixtures';
import {
  hCaptchaGatewayConfigServiceMock
} from '../../../common/config/spec/gateway-config-service.mock';

const httpServiceMock = {
  request: jest.fn(),
};

const environmentConfigServiceMock = {
  hcaptchaLabelingApiKey: 'mock-api-key',
  hcaptchaLabelingApiUrl: 'https://api.example.com',
  reputationOracleUrl: 'https://oracle.example.com',
};

describe('HCaptchaLabelingGateway', () => {
  let gateway: HCaptchaLabelingGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [
        HCaptchaLabelingMapperProfile,
        HCaptchaLabelingGateway,
        GatewayConfigService,

        { provide: HttpService, useValue: httpServiceMock },
        {
          provide: EnvironmentConfigService,
          useValue: environmentConfigServiceMock,
        },
      ],
    })
      .overrideProvider(GatewayConfigService)
      .useValue(hCaptchaGatewayConfigServiceMock)
      .compile();

    gateway = module.get<HCaptchaLabelingGateway>(HCaptchaLabelingGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('sendTokenToVerify', () => {
    it('should send token to verify successfully and verify mapping', async () => {
      httpServiceMock.request.mockReturnValue(
        of({ data: successfulVerifyTokenApiResponseFixture }),
      );

      const result = await gateway.sendTokenToVerify(verifyTokenCommandFixture);
      expect(result).toEqual(successfulVerifyTokenApiResponseFixture);

      const expectedOptions: AxiosRequestConfig = {
        method: 'POST',
        url: 'https://api.example.com/siteverify',
        headers: {},
        params: toCleanObjParams(verifyTokenDataFixture),
      };
      expect(httpServiceMock.request).toHaveBeenCalledWith(expectedOptions);
    });
  });

  describe('fetchDailyHmtSpent', () => {
    it('should fetch daily HMT spent successfully', async () => {
      httpServiceMock.request.mockReturnValue(
        of({ data: dailyHmtSpentResponseFixture }),
      );

      const result = await gateway.fetchDailyHmtSpent();
      expect(result).toEqual(dailyHmtSpentResponseFixture);

      const expectedOptions: AxiosRequestConfig = {
        method: 'GET',
        url: 'https://api.example.com/requester/daily_hmt_spend',
        headers: {},
        params: { api_key: 'mock-api-key', actual: false },
      };
      expect(httpServiceMock.request).toHaveBeenCalledWith(expectedOptions);
    });
  });

  describe('fetchUserStats', () => {
    it('should fetch user stats successfully and verify mapping', async () => {
      httpServiceMock.request.mockReturnValue(
        of({ data: userStatsApiResponseFixture }),
      );

      const result = await gateway.fetchUserStats('test@example.com');
      expect(result).toEqual(userStatsResponseFixture);

      const expectedOptions: AxiosRequestConfig = {
        method: 'GET',
        url: `https://api.example.com/support/labeler/test@example.com`,
        headers: {},
        params: { api_key: 'mock-api-key' },
      };
      expect(httpServiceMock.request).toHaveBeenCalledWith(expectedOptions);
    });
  });
});
