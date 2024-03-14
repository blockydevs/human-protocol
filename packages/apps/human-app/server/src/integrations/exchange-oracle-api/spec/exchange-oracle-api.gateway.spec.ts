import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ExchangeOracleApiGateway } from '../exchange-oracle-api.gateway';
import {
  oracleStatsCommandFixture,
  statisticsExchangeOracleUrl,
  userStatsCommandFixture,
} from '../../../modules/statistics/spec/statistics.fixtures';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import nock, { RequestBodyMatcher } from 'nock';
import { of } from 'rxjs';
import {
  jobAssignmentCommandFixture,
  jobAssignmentDataFixture,
  jobAssignmentOracleUrl,
  jobsFetchParamsCommandFixture,
  jobsFetchParamsDataFixtureAsString,
} from '../../../modules/job-assignment/spec/job-assignment.fixtures';
import { ExchangeOralceApiProfile } from '../exchange-oracle-api.mapper';
import {
  jobsDiscoveryParamsCommandFixture,
  paramsDataFixtureAsString,
} from '../../../modules/jobs-discovery/spec/jobs-discovery.fixtures';

describe('ExchangeOracleApiGateway', () => {
  let gateway: ExchangeOracleApiGateway;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [
        ExchangeOralceApiProfile,
        ExchangeOracleApiGateway,
        {
          provide: HttpService,
          useValue: {
            request: jest.fn().mockReturnValue(of({ data: 'mocked response' })),
          },
        },
      ],
    }).compile();

    gateway = module.get<ExchangeOracleApiGateway>(ExchangeOracleApiGateway);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('fetchUserStatistics', () => {
    it('should successfully call the requested url for user statistics', async () => {
      const command = userStatsCommandFixture;
      nock(statisticsExchangeOracleUrl)
        .get('/stats/assignment')
        .matchHeader('Authorization', `Bearer ${command.token}`)
        .reply(200);
      await gateway.fetchUserStatistics(command);
      expect(httpService.request).toHaveBeenCalled();
    });
  });
  describe('fetchOracleStatistics', () => {
    it('should successfully call the requested url for oracle statistics', async () => {
      const command = oracleStatsCommandFixture;
      nock(statisticsExchangeOracleUrl).get('/stats').reply(200);
      await gateway.fetchOracleStatistics(command);
      expect(httpService.request).toHaveBeenCalled();
    });
  });
  describe('fetchAssignedJobs', () => {
    it('should successfully call get assigned jobs', async () => {
      const command = jobsFetchParamsCommandFixture;
      nock(jobAssignmentOracleUrl)
        .get(`/assignment${jobsFetchParamsDataFixtureAsString}`)
        .reply(200);
      await gateway.fetchAssignedJobs(command);
      expect(httpService.request).toHaveBeenCalled();
    });
  });
  describe('postNewJobAssignment', () => {
    it('should successfully post new job assignment', async () => {
      const command = jobAssignmentCommandFixture;
      const data = jobAssignmentDataFixture;
      const matcher: RequestBodyMatcher = {
        escrowAddress: data.escrow_address,
        chainId: data.chain_id,
      };
      nock(jobAssignmentOracleUrl).post('/assignment', matcher).reply(200);
      await gateway.postNewJobAssignment(command);
      expect(httpService.request).toHaveBeenCalled();
    });
  });

  describe('fetchDiscoveredJobs', () => {
    it('should successfully call get discovered jobs', async () => {
      const command = jobsDiscoveryParamsCommandFixture;
      nock(jobAssignmentOracleUrl)
        .get(`/assignment${paramsDataFixtureAsString}`)
        .reply(200);
      await gateway.fetchDiscoveredJobs(command);
      expect(httpService.request).toHaveBeenCalled();
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });
});
