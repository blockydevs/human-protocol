import { StatisticsService } from './statistics.service';
import { Module } from '@nestjs/common';
import { ExchangeOracleModule } from '../../integrations/exchange-oracle/exchange-oracle.module';
import { KvStoreModule } from '../../integrations/kv-store/kv-store.module';
import { StatisticsProfile } from './statistics.mapper.profile';

@Module({
  imports: [ExchangeOracleModule, KvStoreModule],
  providers: [StatisticsService, StatisticsProfile],
  exports: [StatisticsService],
})
export class StatisticsModule {}
