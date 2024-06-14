import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import {
  VerifyTokenCommand,
  VerifyTokenData,
} from '../../modules/h-captcha/model/verify-token.model';

@Injectable()
export class HCaptchaLabelingMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, VerifyTokenCommand, VerifyTokenData);
    };
  }
}
