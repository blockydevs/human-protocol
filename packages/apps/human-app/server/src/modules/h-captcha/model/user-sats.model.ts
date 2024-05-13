import { AutoMap } from '@automapper/classes';

export class UserStatsCommand {
  @AutoMap()
  email: string;
  @AutoMap()
  hcaptchaSiteKey: string;
}
export class UserStatsApiResponse {
  solved: number;
  served: number;
  verified: number;
  balance: number;
  dropoff_data: UserDropoffData[];
}
export class UserDropoffData {
  [date: string]: any;
}
export class UserStatsResponse {
  solved: number;
  served: number;
  verified: number;
  balance: number;
  currentDateStats: UserDropoffData;
}
