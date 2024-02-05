import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PayoutStatus, PrizeType } from "./finance.enum";
import {PrizePayoutDto} from "../dto/prize-payout.dto";

@Entity("prize_payout")
@Index("uk1_prize_payout", ["ticketId"], { unique: true })
export class PrizePayout {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "prize_type", type: "enum", enum: PrizeType, default: PrizeType.SMALL_PRIZE })
  prizeType: PrizeType;

  @Column({ name: "request_date", type: "datetime" })
  requestDate: Date;

  @Column({ name: "ticket_id", type: "varchar", length: 100 })
  ticketId: string;

  @Column({ name: "player_id", type: "int" })
  playerId: number;

  @Column({ name: "payout_status", type: "enum", enum: PayoutStatus, default: PayoutStatus.CLAIMABLE })
  payoutStatus: PayoutStatus;

  @Column({ name: "manager_id", type: "int" })
  managerId: number;

  @Column({ name: "confirm_date", type: "datetime", nullable: true })
  confirmDate: Date;

  @Column({ name: "confirm_yn", type: "boolean", default: false })
  confirmYn: boolean;

  @Column({ name: "super_manager_id", type: "int" })
  superManagerId: number;

  @Column({ name: "payout_date", type: "datetime", nullable: true })
  payoutDate: Date;

  @Column({ name: "payout_yn", type: "boolean", default: false })
  payoutYn: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(
    id: number,
    prizeType: PrizeType,
    requestDate: Date,
    ticketId: string,
    playerId: number,
    payoutStatus: PayoutStatus,
    managerId: number,
    confirmDate: Date,
    confirmYn: boolean,
    superManagerId: number,
    payoutDate: Date,
    payoutYn: boolean,
  ) {
    const newClass = new PrizePayout();
    newClass.id = id;
    newClass.prizeType = prizeType;
    newClass.requestDate = requestDate;
    newClass.ticketId = ticketId;
    newClass.playerId = playerId;
    newClass.payoutStatus = payoutStatus;
    newClass.managerId = managerId;
    newClass.confirmDate = confirmDate;
    newClass.confirmYn = confirmYn;
    newClass.superManagerId = superManagerId;
    newClass.payoutDate = payoutDate;
    newClass.payoutYn = payoutYn;
    return newClass;
  }

  static new(prizePayout: PrizePayout) {
    const newClass = new PrizePayout();
    newClass.id = prizePayout.id;
    newClass.prizeType = prizePayout.prizeType;
    newClass.requestDate = prizePayout.requestDate;
    newClass.ticketId = prizePayout.ticketId;
    newClass.playerId = prizePayout.playerId;
    newClass.payoutStatus = prizePayout.payoutStatus;
    newClass.managerId = prizePayout.managerId;
    newClass.confirmDate = prizePayout.confirmDate;
    newClass.confirmYn = prizePayout.confirmYn;
    newClass.superManagerId = prizePayout.superManagerId;
    newClass.payoutDate = prizePayout.payoutDate;
    newClass.payoutYn = prizePayout.payoutYn;
    return newClass;
  }

  toPrizePayoutDto() {
    const newClass = new PrizePayoutDto();
    newClass.id = this.id;
    newClass.prizeType = this.prizeType;
    newClass.requestDate = this.requestDate;
    newClass.ticketId = this.ticketId;
    newClass.playerId = this.playerId;
    newClass.payoutStatus = this.payoutStatus;
    newClass.managerId = this.managerId;
    newClass.confirmDate = this.confirmDate;
    newClass.confirmYn = this.confirmYn;
    newClass.superManagerId = this.superManagerId;
    newClass.payoutDate = this.payoutDate;
    newClass.payoutYn = this.payoutYn;
    return newClass;
  }
}
