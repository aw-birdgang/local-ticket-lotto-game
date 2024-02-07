import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RequestRefreshTokenDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  refreshToken: string;

  @ApiProperty()
  @IsString()
  accessToken: string;
}
