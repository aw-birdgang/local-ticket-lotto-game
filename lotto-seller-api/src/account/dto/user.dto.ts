import { IsBoolean, IsEmail, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsBoolean()
  emailVerified: boolean;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsBoolean()
  phoneVerified: boolean;

  @ApiProperty()
  @IsString()
  fullName: string;
}
