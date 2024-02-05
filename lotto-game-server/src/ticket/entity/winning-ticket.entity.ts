import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";
import {WinningTicketDto} from "../dto/winning-ticket.dto";
import {PrizeStatus} from "../../finance/entity/finance.enum";

@Entity("winning_ticket")
@Index("ix1_winning_ticket", ["ownerId"], { unique: false })
export class WinningTicket {
  @PrimaryColumn({ name: "ticket_id", type: "varchar", length: 100 })
  ticketId: string;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @Column({ name: "round_id", type: "int" })
  roundId: number;

  @Column({ name: "ranking", type: "tinyint" })
  ranking: number;

  @Column({ name: "claim_date", type: "datetime", nullable: true })
  claimDate: Date;

  @Column({ name: "prize_amount", type: "int" })
  prizeAmount: number;

  @Column({ name: "prize_status", type: "enum", enum: PrizeStatus, default: PrizeStatus.CLAIMABLE })
  prizeStatus: PrizeStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(
    ticketId: string,
    ownerId: number,
    roundId: number,
    ranking: number,
    claimDate: Date,
    prizeAmount: number,
    prizeStatus: PrizeStatus,
  ) {
    const newClass = new WinningTicket();
    newClass.ticketId = ticketId;
    newClass.ownerId = ownerId;
    newClass.roundId = roundId;
    newClass.ranking = ranking;
    newClass.claimDate = claimDate;
    newClass.prizeAmount = prizeAmount;
    newClass.prizeStatus = prizeStatus;
    return newClass;
  }

  toWinningTicketDto() {
    const winningTicketDto = new WinningTicketDto();
    winningTicketDto.ticketId = this.ticketId;
    winningTicketDto.ownerId = this.ownerId;
    winningTicketDto.roundId = this.roundId;
    winningTicketDto.ranking = this.ranking;
    winningTicketDto.claimDate = this.claimDate;
    winningTicketDto.prizeAmount = this.prizeAmount;
    winningTicketDto.prizeStatus = this.prizeStatus;
    return winningTicketDto;
  }
}
