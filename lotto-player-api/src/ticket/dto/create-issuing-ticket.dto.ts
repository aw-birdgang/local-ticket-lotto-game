import { ApiProperty } from "@nestjs/swagger";

export class CreateIssuingTicketDto {
  @ApiProperty({ type: Number })
  ownerId: number;

  @ApiProperty({ type: Number })
  gameId: number;

  @ApiProperty({ type: Number })
  turnNumber: number;

  @ApiProperty({ type: Number })
  ball1: number;

  @ApiProperty({ type: Number })
  ball2: number;

  @ApiProperty({ type: Number })
  ball3: number;

  @ApiProperty({ type: Number })
  ball4: number;

  @ApiProperty({ type: Number })
  ball5: number;

  @ApiProperty({ type: Number })
  ball6: number;
}
