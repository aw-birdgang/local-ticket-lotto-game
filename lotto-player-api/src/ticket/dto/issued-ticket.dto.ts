import { IsDate, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class IssuedTicketDto {
  @ApiProperty()
  @IsString()
  ticketId: string;

  @ApiProperty()
  @IsDate()
  issueDate: Date;

  @ApiProperty()
  @IsNumber()
  roundId: number;

  @ApiProperty()
  @IsNumber()
  ball1: number;

  @ApiProperty()
  @IsNumber()
  ball2: number;

  @ApiProperty()
  @IsNumber()
  ball3: number;

  @ApiProperty()
  @IsNumber()
  ball4: number;

  @ApiProperty()
  @IsNumber()
  ball5: number;

  @ApiProperty()
  @IsNumber()
  ball6: number;

  @ApiProperty()
  @IsDate()
  expireDate: Date;
}
