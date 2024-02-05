import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { TicketStatus } from "./ticket.enum";
import {TicketDto} from "../dto/ticket.dto";

@Entity("ticket")
@Index("ix1_ticket", ["bundleTicketId"], { unique: false })
@Index("ix2_ticket", ["ownerId"], { unique: false })
export class Ticket {
  @PrimaryColumn({ name: "id", type: "varchar", length: 100 })
  id: string;

  @Column({ name: "bundle_ticket_id", type: "varchar", length: 100 })
  bundleTicketId: string;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @Column({ name: "round_id", type: "int" })
  roundId: number;

  @Column({
    type: "enum",
    enum: TicketStatus,
    default: TicketStatus.ISSUED,
  })
  status: TicketStatus;

  @Column({ name: "ticket_currency_id", type: "int" })
  ticketCurrencyId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(id: string, bundleTicketId: string, ownerId: number, roundId: number, status: TicketStatus, ticketCurrencyId: number) {
    const ticket = new Ticket();
    ticket.id = id;
    ticket.bundleTicketId = bundleTicketId;
    ticket.ownerId = ownerId;
    ticket.roundId = roundId;
    ticket.status = status;
    ticket.ticketCurrencyId = ticketCurrencyId;
    return ticket;
  }

  toTicketDto() {
    const ticketDto = new TicketDto();
    ticketDto.id = this.id;
    ticketDto.bundleTicketId = this.bundleTicketId;
    ticketDto.ownerId = this.ownerId;
    ticketDto.roundId = this.roundId;
    ticketDto.status = this.status;
    ticketDto.ticketCurrencyId = this.ticketCurrencyId;
    return ticketDto;
  }
}
