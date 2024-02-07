import { ApiProperty } from "@nestjs/swagger";
import { RoundDto } from "./round.dto";
import { BatchRoundAggregationDto } from "./batch-round-aggregation.dto";
import { BatchRoundRankingDto } from "./batch-round-ranking.dto";
import { WinningNumberDto } from "./winning-number.dto";

export class RoundSummaryDto {
  @ApiProperty()
  roundDto: RoundDto;

  @ApiProperty()
  winningNumberDto: WinningNumberDto;

  @ApiProperty()
  batchRoundAggregationDto: BatchRoundAggregationDto;

  @ApiProperty()
  batchRoundRankingDtoList: BatchRoundRankingDto[];
}
