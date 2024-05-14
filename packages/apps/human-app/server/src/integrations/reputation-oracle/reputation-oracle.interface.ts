import { SignupWorkerData } from '../../modules/user-worker/model/worker-registration.model';
import {
  SigninOperatorData,
  SignupOperatorData,
} from '../../modules/user-operator/model/operator.model';
import { SigninWorkerData } from '../../modules/user-worker/model/worker-signin.model';
import { EmailVerificationData } from '../../modules/email-confirmation/model/email-verification.model';
import { ResendEmailVerificationData } from '../../modules/email-confirmation/model/resend-email-verification.model';
import { PrepareSignatureData } from '../../modules/prepare-signature/model/prepare-signature.model';
import { DisableOperatorData } from '../../modules/disable-operator/model/disable-operator.model';
import { EnableLabelingData } from '../../modules/h-captcha/model/enable-labeling.model';

export type RequestDataType =
  | SignupWorkerData
  | SignupOperatorData
  | SigninWorkerData
  | EmailVerificationData
  | ResendEmailVerificationData
  | PrepareSignatureData
  | DisableOperatorData
  | EnableLabelingData
  | SigninOperatorData;
