import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("batch_job")
@Index("uk1_batch_job", ["roundId"], { unique: true })
export class BatchJob {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "worker_id", type: "int" })
  workerId: number;

  @Column({ name: "registration_date", type: "datetime" })
  registrationDate: Date;

  @Column({ name: "start_date", type: "datetime", nullable: true })
  startDate: Date;

  @Column({ name: "end_date", type: "datetime", nullable: true })
  endDate: Date;

  @Column({ name: "round_id", type: "int" })
  roundId: number;

  @Column({ name: "rule_id", type: "int" })
  ruleId: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  toBatchJobDto() {
    const newClass = new BatchJob();
    newClass.id = this.id;
    newClass.workerId = this.workerId;
    newClass.registrationDate = this.registrationDate;
    newClass.startDate = this.startDate;
    newClass.endDate = this.endDate;
    newClass.roundId = this.roundId;
    newClass.ruleId = this.ruleId;
    return newClass;
  }
}
