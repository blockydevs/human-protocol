import { JobsDiscoveryService } from './jobs-discovery.service';
import { JobsDiscoveryProfile } from './jobs-discovery.mapper';
import { Module } from '@nestjs/common';
import { ExchangeOracleApiModule } from '../../integrations/exchange-oracle-api/exchange-oracle-api.module';

@Module({
  imports: [ExchangeOracleApiModule],
  providers: [JobsDiscoveryService, JobsDiscoveryProfile],
  exports: [JobsDiscoveryService],
})
export class JobsDiscoveryModule {}
