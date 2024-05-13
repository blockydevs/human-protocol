import { Module } from '@nestjs/common';
import { OracleDiscoveryProfile } from './oracle-discovery.mapper.profile';
import { OracleDiscoveryService } from './oracle-discovery.service';

@Module({
  providers: [OracleDiscoveryService],
  exports: [OracleDiscoveryService],
})
export class OracleDiscoveryModule {}
