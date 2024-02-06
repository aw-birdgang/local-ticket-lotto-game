import { IsBoolean, IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AdminUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  companyId: number;

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
