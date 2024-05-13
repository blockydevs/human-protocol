import { AutoMap } from '@automapper/classes';

export class DailyHmtSpentCommand {
  @AutoMap()
  hcaptchaSiteKey: string;
}
export class DailyHmtSpentResponse {
  spend: number;
}
