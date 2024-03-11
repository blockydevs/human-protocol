import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import {
  UserStatisticsCommand,
  UserStatisticsResponse,
} from '../../modules/statistics/interfaces/user-statistics.interface';
import { HttpService } from '@nestjs/axios';
import {
  OracleStatisticsCommand,
  OracleStatisticsResponse,
} from '../../modules/statistics/interfaces/oracle-statistics.interface';
import {
  JobAssignmentCommand,
  JobAssignmentData,
  JobAssignmentParams,
  JobAssignmentResponse,
  JobsFetchParams,
  JobsFetchParamsCommand,
  JobsFetchParamsData,
  JobsFetchResponse,
} from '../../modules/job-assignment/interfaces/job-assignment.interface';
import {
  JobsDiscoveryParams,
  JobsDiscoveryParamsCommand, JobsDiscoveryParamsData,
  JobsDiscoveryResponse,
} from '../../modules/jobs-discovery/interfaces/jobs-discovery.interface';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';

@Injectable()
export class ExternalApiGateway {
  constructor(
    private httpService: HttpService,
    @InjectMapper() private mapper: Mapper,
  ) {}
  private async callExternalHttpUtilRequest<T>(
    options: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await lastValueFrom(
      this.httpService.request(options),
    );
    return response.data;
  }
  async fetchUserStatistics(
    command: UserStatisticsCommand,
  ): Promise<UserStatisticsResponse> {
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${command.oracleUrl}/stats/assignment`,
      headers: {
        Authorization: `Bearer ${command.token}`,
      },
    };
    return this.callExternalHttpUtilRequest<UserStatisticsResponse>(options);
  }
  async fetchOracleStatistics(
    command: OracleStatisticsCommand,
  ): Promise<OracleStatisticsResponse> {
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${command.oracleUrl}/stats`,
    };
    return this.callExternalHttpUtilRequest<OracleStatisticsResponse>(options);
  }
  async fetchAssignedJobs(
    command: JobsFetchParamsCommand,
  ): Promise<JobsFetchResponse> {
    const options: AxiosRequestConfig = {
      method: 'GET',
      url: `${command.exchangeOracleUrl}/assignment`,
      params: this.mapper.map(
        command.data,
        JobsFetchParams,
        JobsFetchParamsData,
      ),
    };
    return this.callExternalHttpUtilRequest<JobsFetchResponse>(options);
  }
  async postNewJobAssignment(
    command: JobAssignmentCommand,
  ): Promise<JobAssignmentResponse> {
    const options: AxiosRequestConfig = {
      method: 'POST',
      url: `${command.exchangeOracleUrl}/assignment`,
      data: this.mapper.map(
        command.data,
        JobAssignmentParams,
        JobAssignmentData,
      ),
      headers: {
        Authorization: `Bearer ${command.token}`,
      },
    };
    return this.callExternalHttpUtilRequest<JobAssignmentResponse>(options);
  }
  async fetchDiscoveredJobs(command: JobsDiscoveryParamsCommand) {
    let options: AxiosRequestConfig = {
      method: 'GET',
      url: `${command.exchangeOracleUrl}/jobs`,
      params: this.mapper.map(
        command.data,
        JobsDiscoveryParams,
        JobsDiscoveryParamsData,
      ),
      headers: {
        Authorization: `Bearer ${command.token}`,
      },
    };
    return this.callExternalHttpUtilRequest<JobsDiscoveryResponse>(options);
  }
}
