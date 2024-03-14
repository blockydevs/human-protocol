import { StatisticsService } from './statistics.service';
import { Module } from '@nestjs/common';
import { ExchangeOracleApiModule } from '../../integrations/exchange-oracle-api/exchange-oracle-api.module';

@Module({
  imports: [ExchangeOracleApiModule],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
