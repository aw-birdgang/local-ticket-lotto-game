import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import {BatchRoundAggregationDto} from "../dto/batch-round-aggregation.dto";

@Entity("batch_round_aggregation")
export class BatchRoundAggregation {
  @PrimaryColumn({ name: "batch_job_id", type: "int" })
  batchJobId: number;

  @Column({ name: "total_ticket_quantity", type: "int" })
  totalTicketQuantity: number;

  @Column({ name: "total_ticket_amount", type: "int" })
  totalTicketAmount: number;

  @Column({ name: "total_prize_amount", type: "int" })
  totalPrizeAmount: number;

  @Column({ name: "total_donation_amount", type: "int" })
  totalDonationAmount: number;

  @Column({ name: "total_commission_amount", type: "int" })
  totalCommissionAmount: number;

  @Column({ name: "total_operating_amount", type: "int" })
  totalOperatingAmount: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static new(batchRoundAggregation: BatchRoundAggregation) {
    const newClass = new BatchRoundAggregation();
    newClass.batchJobId = batchRoundAggregation.batchJobId;
    newClass.totalTicketQuantity = batchRoundAggregation.totalTicketQuantity;
    newClass.totalTicketAmount = batchRoundAggregation.totalTicketAmount;
    newClass.totalPrizeAmount = batchRoundAggregation.totalPrizeAmount;
    newClass.totalDonationAmount = batchRoundAggregation.totalDonationAmount;
    newClass.totalCommissionAmount = batchRoundAggregation.totalCommissionAmount;
    newClass.totalOperatingAmount = batchRoundAggregation.totalOperatingAmount;
    return newClass;
  }

  toBatchRoundAggregationDto() {
    const roundAggregationDto = new BatchRoundAggregationDto();
    roundAggregationDto.batchJobId = this.batchJobId;
    roundAggregationDto.totalTicketQuantity = this.totalTicketQuantity;
    roundAggregationDto.totalTicketAmount = this.totalTicketAmount;
    roundAggregationDto.totalPrizeAmount = this.totalPrizeAmount;
    roundAggregationDto.totalDonationAmount = this.totalDonationAmount;
    roundAggregationDto.totalCommissionAmount = this.totalCommissionAmount;
    roundAggregationDto.totalOperatingAmount = this.totalOperatingAmount;
    return roundAggregationDto;
  }
}
