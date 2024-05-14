import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  mapWith,
} from '@automapper/core';
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
      createMap(
        mapper,
        VerifyTokenCommand,
        VerifyTokenData,
        forMember(
          (destination) => destination.secret,
          mapFrom((source) => source.polygonWalletAddr),
        ),
        forMember(
          (destination) => destination.sitekey,
          mapFrom((source) => source.hcaptchaSiteKey),
        ),
        forMember(
          (destination) => destination.response,
          mapFrom((source) => source.hcaptchaToken),
        ),
      );
      createMap(
        mapper,
        UserStatsApiResponse,
        UserStatsResponse,
        forMember(
          (destination) => destination.solved,
          mapFrom((source) => source.solved),
        ),
        forMember(
          (destination) => destination.served,
          mapFrom((source) => source.served),
        ),
        forMember(
          (destination) => destination.verified,
          mapFrom((source) => source.verified),
        ),
        forMember(
          (destination) => destination.balance,
          mapFrom((source) => source.balance),
        ),
        forMember(
          (destination) => destination.currentDateStats,
          mapFrom((source) =>
            Array.isArray(source.dropoff_data) && source.dropoff_data.length > 0
              ? source.dropoff_data[source.dropoff_data.length - 1]
              : undefined,
          ),
        ),
      );
    };
  }
}
