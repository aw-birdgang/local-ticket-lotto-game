import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CycleCode, RoundStatus } from "./game.enum";
import {RoundDto} from "../dto/round.dto";

@Entity("round")
@Index("uk1_round", ["gameId", "turnNumber"], { unique: true })
export class Round {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "game_id", type: "int" })
  gameId: number;

  @Column({ name: "turn_number", type: "tinyint" })
  turnNumber: number;

  @Column({ name: "start_date", type: "datetime" })
  startDate: Date;

  @Column({ name: "end_date", type: "datetime" })
  endDate: Date;

  @Column({ name: "status", type: "enum", enum: RoundStatus, default: RoundStatus.READY })
  status: RoundStatus;

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

  @Column({ name: "cycle_code", type: "enum", enum: CycleCode, default: CycleCode.WEEKLY })
  cycleCode: CycleCode;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(id: number, gameId: number, turnNumber: number, startDate: Date, endDate: Date, status: RoundStatus, cycleCode: CycleCode) {
    const round = new Round();
    round.id = id;
    round.gameId = gameId;
    round.turnNumber = turnNumber;
    round.startDate = startDate;
    round.endDate = endDate;
    round.status = status;
    round.saleStartDate = startDate;
    round.saleEndDate = endDate;
    round.drawStartDate = startDate;
    round.drawEndDate = endDate;
    round.settlingStartDate = startDate;
    round.settlingEndDate = endDate;
    round.prizeStartDate = startDate;
    round.prizeEndDate = endDate;
    round.cycleCode = cycleCode;
    return round;
  }

  toRoundDto() {
    const roundDto = new RoundDto();
    roundDto.id = this.id;
    roundDto.gameId = this.gameId;
    roundDto.turnNumber = this.turnNumber;
    roundDto.startDate = this.startDate;
    roundDto.endDate = this.endDate;
    roundDto.status = this.status;
    roundDto.saleStartDate = this.startDate;
    roundDto.saleEndDate = this.endDate;
    roundDto.drawStartDate = this.startDate;
    roundDto.drawEndDate = this.endDate;
    roundDto.settlingStartDate = this.startDate;
    roundDto.settlingEndDate = this.endDate;
    roundDto.prizeStartDate = this.startDate;
    roundDto.prizeEndDate = this.endDate;
    roundDto.cycleCode = this.cycleCode;
    return roundDto;
  }
}
