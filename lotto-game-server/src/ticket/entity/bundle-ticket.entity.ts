import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import {BundleTicketDto} from "../dto/bundle-ticket.dto";

@Entity("bundle_ticket")
export class BundleTicket {
  @PrimaryColumn({ name: "id", type: "varchar", length: 100 })
  id: string;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @Column({ name: "purchase_date", type: "datetime" })
  purchaseDate: Date;

  @Column({ name: "ticket_quantity", type: "int" })
  ticketQuantity: number;

  @Column({ name: "ticket_amount", type: "int" })
  ticketAmount: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(id: string, ownerId: number, purchaseDate: Date, ticketQuantity: number, ticketAmount: number) {
    const newClass = new BundleTicket();
    newClass.id = id;
    newClass.ownerId = ownerId;
    newClass.purchaseDate = purchaseDate;
    newClass.ticketQuantity = ticketQuantity;
    newClass.ticketAmount = ticketAmount;
    return newClass;
  }

  toBundleTicketDto() {
    const newClass = new BundleTicketDto();
    newClass.id = this.id;
    newClass.ownerId = this.ownerId;
    newClass.purchaseDate = this.purchaseDate;
    newClass.ticketQuantity = this.ticketQuantity;
    newClass.ticketAmount = this.ticketAmount;
    return newClass;
  }
}
