import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import {
  CamelCaseNamingConvention,
  createMap,
  forMember,
  mapFrom,
  Mapper,
  namingConventions,
  SnakeCaseNamingConvention,
} from '@automapper/core';
import {
  SigninOperatorCommand, SigninOperatorData,
  SignupOperatorCommand,
  SignupOperatorData,
} from '../../modules/user-operator/model/operator.model';
import {
  SignupWorkerCommand,
  SignupWorkerData,
} from '../../modules/user-worker/model/worker-registration.model';
import {
  SigninWorkerCommand,
  SigninWorkerData,
} from '../../modules/user-worker/model/worker-signin.model';
import {
  EnableLabelingCommand,
  EnableLabelingData,
} from '../../modules/h-captcha/model/enable-labeling.model';
import {
  PrepareSignatureCommand,
  PrepareSignatureData,
} from '../../modules/prepare-signature/model/prepare-signature.model';

@Injectable()
export class ReputationOracleProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        SignupWorkerCommand,
        SignupWorkerData,
        forMember(
          (destination) => destination.h_captcha_token,
          mapFrom((source) => source.hCaptchaToken),
        ),
        namingConventions({
          source: new CamelCaseNamingConvention(),
          destination: new SnakeCaseNamingConvention(),
        }),
      );
      createMap(mapper, SignupOperatorCommand, SignupOperatorData);
      createMap(mapper, PrepareSignatureCommand, PrepareSignatureData);
      createMap(mapper, SigninOperatorCommand, SigninOperatorData);
      createMap(
        mapper,
        SigninWorkerCommand,
        SigninWorkerData,
        forMember(
          (destination) => destination.h_captcha_token,
          mapFrom((source) => source.hCaptchaToken),
        ),
        namingConventions({
          source: new CamelCaseNamingConvention(),
          destination: new SnakeCaseNamingConvention(),
        }),
      );
      createMap(mapper, EnableLabelingCommand, EnableLabelingData);
    };
  }
}
