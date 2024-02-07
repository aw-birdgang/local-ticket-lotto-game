import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { ClientAccessType } from "./account.enum";

export class EditTokenParameter {
  @ApiProperty()
  @IsNumber()
  accessUserId: number;

  @ApiProperty()
  @IsEnum(ClientAccessType)
  accessType: ClientAccessType;

  @ApiProperty()
  @IsString()
  jwtRefreshToken: string;

  static from(accessUserId: number, accessType: ClientAccessType, jwtRefreshToken: string) {
    const parameter = new EditTokenParameter();
    parameter.accessUserId = accessUserId;
    parameter.accessType = accessType;
    parameter.jwtRefreshToken = jwtRefreshToken;
    return parameter;
  }
}
