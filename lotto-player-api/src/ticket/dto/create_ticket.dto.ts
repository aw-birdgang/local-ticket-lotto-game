import { IsDate, IsEnum, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import {TicketStatus} from "../entity/ticket.enum";

export class CreateEmptyTicketDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ enum: TicketStatus })
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @ApiProperty()
  @IsNumber()
  creatorId: number;

  @ApiProperty()
  @IsDate()
  createDate: Date;

  @ApiProperty()
  @IsDate()
  expireDate: Date;
}
