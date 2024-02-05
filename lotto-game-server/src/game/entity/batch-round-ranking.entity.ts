import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { isEmpty } from "class-validator";
import {BatchRoundRankingDto} from "../dto/batch-round-ranking.dto";

@Entity("batch_round_ranking")
@Index("uk1_batch_round_ranking", ["batchJobId", "ranking"], { unique: true })
export class BatchRoundRanking {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "batch_job_id", type: "int" })
  batchJobId: number;

  @Column({ name: "ranking", type: "tinyint" })
  ranking: number;

  @Column({ name: "total_amount", type: "int" })
  totalAmount: number;

  @Column({ name: "total_quantity", type: "int" })
  totalQuantity: number;

  @Column({ name: "prize_amount_per_ticket", type: "int" })
  prizeAmountPerTicket: number;

  @Column({ name: "payout_prize_amount", type: "int" })
  payoutPrizeAmount: number;

  @Column({ name: "payout_prize_quantity", type: "int" })
  payoutPrizeQuantity: number;

  @Column({ name: "not_payout_prize_amount", type: "int" })
  notPayoutPrizeAmount: number;

  @Column({ name: "not_payout_prize_quantity", type: "int" })
  notPayoutPrizeQuantity: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static new(batchRoundRanking: BatchRoundRanking) {
    const newClass = new BatchRoundRanking();
    newClass.id = batchRoundRanking.id;
    newClass.batchJobId = batchRoundRanking.batchJobId;
    newClass.ranking = batchRoundRanking.ranking;
    newClass.totalAmount = batchRoundRanking.totalAmount;
    newClass.totalQuantity = batchRoundRanking.totalQuantity;
    newClass.prizeAmountPerTicket = batchRoundRanking.prizeAmountPerTicket;
    newClass.payoutPrizeAmount = batchRoundRanking.payoutPrizeAmount;
    newClass.payoutPrizeQuantity = batchRoundRanking.payoutPrizeQuantity;
    newClass.notPayoutPrizeAmount = batchRoundRanking.notPayoutPrizeAmount;
    newClass.notPayoutPrizeQuantity = batchRoundRanking.notPayoutPrizeQuantity;
    newClass.createdAt = batchRoundRanking.createdAt;
    newClass.updatedAt = batchRoundRanking.updatedAt;
    return newClass;
  }

  toBatchRoundRankingDto() {
    const batchRoundRankingDto = new BatchRoundRankingDto();
    batchRoundRankingDto.id = this.id;
    batchRoundRankingDto.batchJobId = this.batchJobId;
    batchRoundRankingDto.ranking = this.ranking;
    batchRoundRankingDto.totalAmount = this.totalAmount;
    batchRoundRankingDto.totalQuantity = this.totalQuantity;
    batchRoundRankingDto.prizeAmountPerTicket = this.prizeAmountPerTicket;
    batchRoundRankingDto.payoutPrizeAmount = this.payoutPrizeAmount;
    batchRoundRankingDto.payoutPrizeQuantity = this.payoutPrizeQuantity;
    batchRoundRankingDto.notPayoutPrizeAmount = this.notPayoutPrizeAmount;
    batchRoundRankingDto.notPayoutPrizeQuantity = this.notPayoutPrizeQuantity;
    return batchRoundRankingDto;
  }

  static fromList(batchRoundRankingList: BatchRoundRanking[]) {
    if (isEmpty(batchRoundRankingList) || batchRoundRankingList.length <= 0) {
      return;
    }
    return batchRoundRankingList.map((value) => BatchRoundRanking.new(value).toBatchRoundRankingDto());
  }
}
