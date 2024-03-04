import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { createMap, Mapper } from '@automapper/core';
import {
  JobAssignmentCommand,
  JobAssignmentData,
  JobAssignmentDto,
  JobsAssignmentParamsCommand,
  JobsAssignmentParamsData,
  JobsAssignmentParamsDto,
} from './interfaces/job-assignment.interface';

@Injectable()
export class JobAssignmentProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, JobAssignmentDto, JobAssignmentCommand);
      createMap(mapper, JobAssignmentCommand, JobAssignmentData);
      createMap(mapper, JobsAssignmentParamsDto, JobsAssignmentParamsCommand);
      createMap(mapper, JobsAssignmentParamsCommand, JobsAssignmentParamsData);
    };
  }
}
