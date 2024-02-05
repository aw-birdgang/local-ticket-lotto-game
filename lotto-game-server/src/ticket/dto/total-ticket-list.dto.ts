import { ApiProperty } from "@nestjs/swagger";

export class TotalTicketListDto {
  @ApiProperty({ example: "lk1j23kl1jqlwdksjasdklasasdasdasdasd" })
  id: string;

  @ApiProperty({ example: "lose" })
  status: string;

  @ApiProperty({ example: "test@gpex.io" })
  userEmail: string;

  @ApiProperty({ example: "2023-10-07T09:00:00.000Z" })
  drawStartDate: Date;

  @ApiProperty({ example: "2023-10-14T08:59:59.000Z" })
  drawEndDate: Date;

  @ApiProperty({ example: "2023-10-17T00:48:44.000Z" })
  issuanceDate: Date;

  @ApiProperty({ example: 22 })
  drawNumber1: number;

  @ApiProperty({ example: 30 })
  drawNumber2: number;

  @ApiProperty({ example: 40 })
  drawNumber3: number;

  @ApiProperty({ example: 44 })
  drawNumber4: number;

  @ApiProperty({ example: 48 })
  drawNumber5: number;

  @ApiProperty({ example: 49 })
  drawNumber6: number;

  @ApiProperty({ example: 5 })
  winningNumber1: number;

  @ApiProperty({ example: 14 })
  winningNumber2: number;

  @ApiProperty({ example: 16 })
  winningNumber3: number;

  @ApiProperty({ example: 36 })
  winningNumber4: number;

  @ApiProperty({ example: 39 })
  winningNumber5: number;

  @ApiProperty({ example: 42 })
  winningNumber6: number;

  @ApiProperty({ example: 24 })
  winningNumberBonus: number;
}
