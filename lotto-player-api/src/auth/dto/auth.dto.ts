import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
    @ApiProperty()
    @IsString()
    jwt: string;

    @ApiProperty()
    @IsString()
    email: string;
    
    @ApiProperty()
    @IsString()
    expiresIn: string;
}