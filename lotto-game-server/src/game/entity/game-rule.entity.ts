import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CycleUnit } from "./game.enum";

@Entity("game_rule")
export class GameRule {
  @PrimaryGeneratedColumn({ name: "game_id", type: "int" })
  gameId: number;

  @Column({ name: "cycle_unit", type: "enum", enum: CycleUnit, default: CycleUnit.WEEKLY })
  cycleUnit: CycleUnit;

  @Column({ name: "sale_start_date", type: "datetime", nullable: true })
  saleStartDate: Date;

  @Column({ name: "sale_end_date", type: "datetime", nullable: true })
  saleEndDate: Date;

  @Column({ name: "draw_start_date", type: "datetime", nullable: true })
  drawStartDate: Date;

  @Column({ name: "draw_end_date", type: "datetime", nullable: true })
  drawEndDate: Date;

  @Column({ name: "settling_start_date", type: "datetime", nullable: true })
  settlingStartDate: Date;

  @Column({ name: "settling_end_date", type: "datetime", nullable: true })
  settlingEndDate: Date;

  @Column({ name: "prize_start_date", type: "datetime", nullable: true })
  prizeStartDate: Date;

  @Column({ name: "prize_end_date", type: "datetime", nullable: true })
  prizeEndDate: Date;

  @Column({ name: "ticket_currency_id", type: "int", nullable: true })
  ticketCurrencyId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
