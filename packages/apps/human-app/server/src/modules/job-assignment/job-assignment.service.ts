import { Injectable } from '@nestjs/common';
import {
  JobsFetchParamsCommand,
  JobAssignmentResponse,
  JobAssignmentCommand,
  JobsFetchResponse,
  ResignJobCommand,
} from './model/job-assignment.model';
import { ExchangeOracleGateway } from '../../integrations/exchange-oracle/exchange-oracle.gateway';
import { KvStoreGateway } from '../../integrations/kv-store/kv-store.gateway';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
@Injectable()
export class JobAssignmentService {
  constructor(
    private readonly kvStoreGateway: KvStoreGateway,
    private readonly exchangeOracleGateway: ExchangeOracleGateway,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async processJobAssignment(
    command: JobAssignmentCommand,
  ): Promise<JobAssignmentResponse> {
    return this.exchangeOracleGateway.postNewJobAssignment(command);
  }

  async processGetAssignedJobs(
    command: JobsFetchParamsCommand,
  ): Promise<JobsFetchResponse> {
    return this.exchangeOracleGateway.fetchAssignedJobs(command);
  }

  async resignJob(command: ResignJobCommand) {
    return this.exchangeOracleGateway.resignAssignedJob(command);
  }
}
