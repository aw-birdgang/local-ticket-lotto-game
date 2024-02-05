import { IsDate, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class IssuedTicketDto {
  @ApiProperty({ type: String })
  @IsString()
  ticketId: string;

  @ApiProperty({ type: Date })
  @IsDate()
  issueDate: Date;

  @ApiProperty({ type: Number })
  @IsNumber()
  roundId: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball1: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball2: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball3: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball4: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball5: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  ball6: number;

  @ApiProperty({ type: Date })
  @IsDate()
  expireDate: Date;
}
