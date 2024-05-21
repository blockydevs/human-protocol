import { AutoMap } from '@automapper/classes';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RegisterAddressDto {
  @AutoMap()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 0 })
  chain_id: number;
  @AutoMap()
  @IsString()
  @ApiProperty({ example: 'string' })
  address: string;
}
export class RegisterAddressCommand {
  @AutoMap()
  chainId: number;
  @AutoMap()
  address: string;
  token: string;
}
export class RegisterAddressData {
  @AutoMap()
  chain_id: number;
  @AutoMap()
  address: string;
}
export class RegisterAddressResponse {
  signed_address: string;
}
