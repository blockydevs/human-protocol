import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HCaptchaLabelingGateway } from './h-captcha-labeling.gateway';
import { HCaptchaMapperProfile } from '../../modules/h-captcha/h-captcha.mapper.profile';

@Module({
  imports: [HttpModule],
  providers: [HCaptchaLabelingGateway, HCaptchaMapperProfile],
  exports: [HCaptchaLabelingGateway],
})
export class HCaptchaLabelingModule {}
