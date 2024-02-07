import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PlayerUserSocialDto {

  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  socialType: string;

  @ApiProperty()
  @IsString()
  accessToken: string;
}
