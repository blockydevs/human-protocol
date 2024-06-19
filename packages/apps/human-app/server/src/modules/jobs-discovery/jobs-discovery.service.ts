import { Injectable } from '@nestjs/common';
import {
  JobsDiscoveryParamsCommand,
  JobsDiscoveryResponse,
} from './model/jobs-discovery.model';
import { ExchangeOracleGateway } from '../../integrations/exchange-oracle/exchange-oracle.gateway';
import { KvStoreGateway } from '../../integrations/kv-store/kv-store.gateway';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
@Injectable()
export class JobsDiscoveryService {
  constructor(
    private readonly kvStoreGateway: KvStoreGateway,
    @InjectMapper() private mapper: Mapper,
    private readonly exchangeOracleGateway: ExchangeOracleGateway,
  ) {}

  async processJobsDiscovery(
    command: JobsDiscoveryParamsCommand,
  ): Promise<JobsDiscoveryResponse> {
    return this.exchangeOracleGateway.fetchJobs(command);
  }
}
