import { Injectable } from '@nestjs/common';
import {
  JobsDiscoveryParamsCommand,
  JobsDiscoveryResponse,
} from './interfaces/jobs-discovery.interface';
import { ExchangeOracleApiGateway } from '../../integrations/exchange-oracle-api/exchange-oracle-api.gateway';
@Injectable()
export class JobsDiscoveryService {
  constructor(private readonly externalApiGateway: ExchangeOracleApiGateway) {}

  async processJobsDiscovery(
    command: JobsDiscoveryParamsCommand,
  ): Promise<JobsDiscoveryResponse> {
    return this.externalApiGateway.fetchDiscoveredJobs(command);
  }
}
