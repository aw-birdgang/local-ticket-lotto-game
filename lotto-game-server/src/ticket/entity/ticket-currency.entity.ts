import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CurrencyCode } from "./ticket.enum";
import {TicketCurrencyDto} from "../dto/ticket-currency.dto";

@Entity("ticket_currency")
export class TicketCurrency {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({
    name: "currency_code",
    type: "enum",
    enum: CurrencyCode,
    default: CurrencyCode.USD,
  })
  currencyCode: CurrencyCode;

  @Column({ name: "amount", type: "int" })
  amount: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  toTicketCurrencyDto() {
    const ticketCurrencyDto = new TicketCurrencyDto();
    ticketCurrencyDto.id = this.id;
    ticketCurrencyDto.currencyCode = this.currencyCode;
    ticketCurrencyDto.amount = this.amount;
    return ticketCurrencyDto;
  }
}
