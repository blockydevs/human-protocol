import { AutoMap } from '@automapper/classes';

export class EnableLabelingCommand {
  @AutoMap()
  isKYCed: boolean;
  @AutoMap()
  polygonWalletAddr: string;
  @AutoMap()
  hcaptchaSiteKey: string;
  @AutoMap()
  email: string;
  @AutoMap()
  country: string;
  @AutoMap()
  _id: string;
}
export class EnableLabelingResponse {
  message: string;
}

export class EnableLabelingData {
  @AutoMap()
  email: string;
  @AutoMap()
  country: string;
  @AutoMap()
  isKYCed: boolean;
  @AutoMap()
  _id: string;
  @AutoMap()
  polygonWalletAddr: string;
  @AutoMap()
  hcaptchaSiteKey: string;
  language = 'en';
}
