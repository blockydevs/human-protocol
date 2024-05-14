import { AutoMap } from '@automapper/classes';

export class JwtUserData {
  @AutoMap()
  _id: string;
  @AutoMap()
  country: string;
  @AutoMap()
  eth_addr: string;
  @AutoMap()
  email: string;
  @AutoMap()
  hcaptchaSiteKey: string;
  @AutoMap()
  polygonWalletAddr: string;
  @AutoMap()
  isKYCed: boolean;
}
