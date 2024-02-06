import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";
import {EmptyTicketDto} from "../dto/empty-ticket.dto";

@Entity("ticket-empty")
@Index("ix1_ticket-empty", ["ownerId"], { unique: false })
export class EmptyTicket {
  @PrimaryColumn({ name: "ticket_id", type: "varchar", length: 100 })
  ticketId: string;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @Column({ name: "round_id", type: "int" })
  roundId: number;

  @Column({ name: "ticket_currency_id", type: "int" })
  ticketCurrencyId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deletedAt: Date | null;

  static from(ticketId: string, ownerId: number, roundId: number, ticketCurrencyId: number) {
    const newClass = new EmptyTicket();
    newClass.ticketId = ticketId;
    newClass.ownerId = ownerId;
    newClass.roundId = roundId;
    newClass.ticketCurrencyId = ticketCurrencyId;
    return newClass;
  }

  toEmptyTicketDto() {
    const newClass = new EmptyTicketDto();
    newClass.ticketId = this.ticketId;
    newClass.ownerId = this.ownerId;
    newClass.roundId = this.roundId;
    newClass.ticketCurrencyId = this.ticketCurrencyId;
    return newClass;
  }
}
