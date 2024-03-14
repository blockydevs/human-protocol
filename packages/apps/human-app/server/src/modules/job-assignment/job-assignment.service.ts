import { Injectable } from '@nestjs/common';
import {
  JobsFetchParamsCommand,
  JobAssignmentResponse,
  JobAssignmentCommand,
  JobsFetchResponse,
} from './interfaces/job-assignment.interface';
import { ExchangeOracleApiGateway } from '../../integrations/exchange-oracle-api/exchange-oracle-api.gateway';
@Injectable()
export class JobAssignmentService {
  constructor(private readonly externalApiGateway: ExchangeOracleApiGateway) {}

  async processJobAssignment(
    command: JobAssignmentCommand,
  ): Promise<JobAssignmentResponse> {
    return this.externalApiGateway.postNewJobAssignment(command);
  }

  async processGetAssignedJobs(
    command: JobsFetchParamsCommand,
  ): Promise<JobsFetchResponse> {
    return this.externalApiGateway.fetchAssignedJobs(command);
  }
}
