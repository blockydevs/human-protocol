import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExchangeOracleApiGateway } from './exchange-oracle-api.gateway';
import { ExchangeOralceApiProfile } from './exchange-oracle-api.mapper';

@Module({
  imports: [HttpModule],
  providers: [ExchangeOracleApiGateway, ExchangeOralceApiProfile],
  exports: [ExchangeOracleApiGateway],
})
export class ExchangeOracleApiModule {}
