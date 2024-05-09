import { Injectable } from '@nestjs/common';
import { ChainId, EscrowUtils } from '@human-protocol/sdk';

@Injectable()
export class EscrowUtilsGateway {
  async getExchangeOracleAddressByEscrowAddress(
    address: string,
  ): Promise<string> {
    const escrowsData = await EscrowUtils.getEscrow(
      ChainId.POLYGON_AMOY,
      address,
    );
    return escrowsData.exchangeOracle || '';
  }
}
