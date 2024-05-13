import { AutoMap } from '@automapper/classes';

export class VerifyTokenDto {
  hcaptchaToken: string;
}
export class VerifyTokenCommand {
  @AutoMap()
  hcaptchaToken: string;
  @AutoMap()
  hcaptchaSiteKey: string;
  @AutoMap()
  polygonWalletAddr: string;
}
export class VerifyTokenData { // TODO: I don't know if this structure has correct fields set
  @AutoMap()
  secret: string;
  @AutoMap()
  sitekey: string;
  @AutoMap()
  response: string;
}

export class VerifyTokenApiResponse {
  success: boolean;
  'error-codes'?: string[];
}
export class VerifyTokenResponse {
  constructor(message: string) {
    this.message = message;
  }
  message: string;
}
