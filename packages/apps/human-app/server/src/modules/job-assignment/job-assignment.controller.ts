import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { JobAssignmentService } from './job-assignment.service';
import {
  JobAssignmentDto,
  JobAssignmentCommand,
  JobAssignmentResponse,
  JobsAssignmentParamsDto,
  JobsAssignmentParamsCommand,
  JobsAssignmentResponse,
} from './interfaces/job-assignment.interface';

@Controller()
export class JobAssignmentController {
  constructor(
    private readonly jobAssignmentService: JobAssignmentService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiTags('Job-Assignment')
  @Post('/assignment/job')
  @ApiOperation({
    summary: 'Request to assign a job to a logged user',
  })
  @UsePipes(new ValidationPipe())
  public async assignJob(
    @Body() jobAssignmentDto: JobAssignmentDto,
  ): Promise<JobAssignmentResponse> {
    const jobAssignmentCommand = this.mapper.map(
      jobAssignmentDto,
      JobAssignmentDto,
      JobAssignmentCommand,
    );
    return this.jobAssignmentService.processJobAssignment(jobAssignmentCommand);
  }

  @ApiTags('Job-Assignment')
  @Get('/assignment/job')
  @ApiOperation({
    summary: 'Request to get a jobs assigned to a logged user',
  })
  public async getAssignedJobs(
    @Query() jobsAssignmentParamsDto: JobsAssignmentParamsDto,
  ): Promise<JobsAssignmentResponse> {
    const jobsAssignmentParamsCommand = this.mapper.map(
      jobsAssignmentParamsDto,
      JobsAssignmentParamsDto,
      JobsAssignmentParamsCommand,
    );
    return this.jobAssignmentService.processGetAssignedJobs(
      jobsAssignmentParamsCommand,
    );
  }
}
