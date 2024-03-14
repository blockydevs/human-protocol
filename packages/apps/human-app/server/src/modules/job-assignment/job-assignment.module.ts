import { JobAssignmentService } from './job-assignment.service';
import { JobAssignmentProfile } from './job-assignment.mapper';
import { Module } from '@nestjs/common';
import { ExchangeOracleApiModule } from '../../integrations/exchange-oracle-api/exchange-oracle-api.module';

@Module({
  imports: [ExchangeOracleApiModule],
  providers: [JobAssignmentService, JobAssignmentProfile],
  exports: [JobAssignmentService],
})
export class JobAssignmentModule {}
