import { AutoMap } from '@automapper/classes';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAddressDto {
  @AutoMap()
  @IsString()
  @ApiProperty({ example: 'string' })
  address: string;
}
export class RegisterAddressCommand {
  @AutoMap()
  address: string;
  token: string;
}
export class RegisterAddressData {
  @AutoMap()
  address: string;
}
export class RegisterAddressResponse {
  signed_address: string;
}
