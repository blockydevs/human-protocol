import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, Mapper, mapWith } from '@automapper/core';
import {
  VerifyTokenCommand,
  VerifyTokenData,
} from '../../modules/h-captcha/model/verify-token.model';
import {
  UserDropoffData,
  UserStatsApiResponse,
  UserStatsResponse,
} from '../../modules/h-captcha/model/user-sats.model';

@Injectable()
export class HCaptchaLabelingMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, VerifyTokenCommand, VerifyTokenData);
      createMap(
        mapper,
        UserStatsApiResponse,
        UserStatsResponse,
        forMember(
          (destination) => destination.currentDateStats,
          mapWith(
            UserDropoffData,
            UserDropoffData,
            (source: any) => source.at(-1), // TODO: this has to be checked, maybe type should be changed
          ),
        ),
      );
    };
  }
}
