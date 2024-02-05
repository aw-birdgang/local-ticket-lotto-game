import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GameStatus } from "./game.enum";

@Entity("game")
export class Game {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "name_id", type: "int", default: 0 })
  nameId: number;

  @Column({ name: "introduction_id", type: "int", default: 0 })
  introductionId: number;

  @Column({ name: "sale_period_id", type: "int", default: 0 })
  salePeriodId: number;

  @Column({ name: "draw_date_id", type: "int", default: 0 })
  drawDateId: number;

  @Column({ name: "ticket_price_id", type: "int", default: 0 })
  ticketPriceId: number;

  @Column({ type: "enum", enum: GameStatus, default: GameStatus.ACTIVE })
  status: GameStatus;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
