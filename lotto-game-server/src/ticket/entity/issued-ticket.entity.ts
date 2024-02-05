import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import {IssuedTicketDto} from "../dto/issued-ticket.dto";

@Entity("issued_ticket")
export class IssuedTicket {
  @PrimaryColumn({ name: "ticket_id", type: "varchar", length: 100 })
  ticketId: string;

  @Column({ name: "issue_date", type: "datetime" })
  issueDate: Date;

  @Column({ name: "round_id", type: "int" })
  roundId: number;

  @Column({ name: "ball_1", type: "tinyint" })
  ball1: number;

  @Column({ name: "ball_2", type: "tinyint" })
  ball2: number;

  @Column({ name: "ball_3", type: "tinyint" })
  ball3: number;

  @Column({ name: "ball_4", type: "tinyint" })
  ball4: number;

  @Column({ name: "ball_5", type: "tinyint" })
  ball5: number;

  @Column({ name: "ball_6", type: "tinyint" })
  ball6: number;

  @Column({ name: "expire_date", type: "datetime" })
  expireDate: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(
    ticketId: string,
    issueDate: Date,
    roundId: number,
    ball1: number,
    ball2: number,
    ball3: number,
    ball4: number,
    ball5: number,
    ball6: number,
    expireDate: Date,
  ) {
    const issuedTicket = new IssuedTicket();
    issuedTicket.ticketId = ticketId;
    issuedTicket.issueDate = issueDate;
    issuedTicket.roundId = roundId;
    issuedTicket.ball1 = ball1;
    issuedTicket.ball2 = ball2;
    issuedTicket.ball3 = ball3;
    issuedTicket.ball4 = ball4;
    issuedTicket.ball5 = ball5;
    issuedTicket.ball6 = ball6;
    issuedTicket.expireDate = expireDate;
    return issuedTicket;
  }

  toIssuedTicketDto() {
    const issuedTicketDto = new IssuedTicketDto();
    issuedTicketDto.ticketId = this.ticketId;
    issuedTicketDto.issueDate = this.issueDate;
    issuedTicketDto.roundId = this.roundId;
    issuedTicketDto.ball1 = this.ball1;
    issuedTicketDto.ball2 = this.ball2;
    issuedTicketDto.ball3 = this.ball3;
    issuedTicketDto.ball4 = this.ball4;
    issuedTicketDto.ball5 = this.ball5;
    issuedTicketDto.ball6 = this.ball6;
    return issuedTicketDto;
  }
}
