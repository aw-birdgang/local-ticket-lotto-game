import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import {WinningNumberDto} from "../dto/winning-number.dto";

@Entity("winning_number")
export class WinningNumber {
  @PrimaryColumn({ name: "round_id", type: "int" })
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

  @Column({ name: "ball_bonus", type: "tinyint" })
  ballBonus: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(
    roundId: number,
    ball1: number,
    ball2: number,
    ball3: number,
    ball4: number,
    ball5: number,
    ball6: number,
    ballBonus: number,
  ) {
    const winningNumber = new WinningNumber();
    winningNumber.roundId = roundId;
    winningNumber.ball1 = ball1;
    winningNumber.ball2 = ball2;
    winningNumber.ball3 = ball3;
    winningNumber.ball4 = ball4;
    winningNumber.ball5 = ball5;
    winningNumber.ball6 = ball6;
    winningNumber.ballBonus = ballBonus;
    return winningNumber;
  }

  toWinningNumberDto() {
    const winningNumberDto = new WinningNumberDto();
    winningNumberDto.roundId = this.roundId;
    winningNumberDto.ball1 = this.ball1;
    winningNumberDto.ball2 = this.ball2;
    winningNumberDto.ball3 = this.ball3;
    winningNumberDto.ball4 = this.ball4;
    winningNumberDto.ball5 = this.ball5;
    winningNumberDto.ball6 = this.ball6;
    winningNumberDto.ballBonus = this.ballBonus;
    return winningNumberDto;
  }
}
