import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { JwtUserData } from '../../common/interfaces/jwt-token.model';
import { EnableLabelingCommand } from './model/enable-labeling.model';
import { DailyHmtSpentCommand } from './model/daily-hmt-spent.model';
import { UserStatsCommand } from './model/user-sats.model';
import { VerifyTokenCommand } from './model/verify-token.model';

@Injectable()
export class HCaptchaMapperProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, JwtUserData, EnableLabelingCommand);
      createMap(mapper, JwtUserData, DailyHmtSpentCommand);
      createMap(mapper, JwtUserData, UserStatsCommand);
      createMap(mapper, JwtUserData, VerifyTokenCommand);
    };
  }
}
