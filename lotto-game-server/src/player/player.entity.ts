import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("player")
@Index("uk1_player", ["playername"], { unique: true })
export class Player {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "playername", type: "varchar" })
  username: string;

  @Column({ name: "password_hash", type: "varchar", length: 200 })
  passwordHash: string;

  @Column({ name: "email", type: "varchar", length: 100 })
  email: string;

  @Column({ name: "email_verified", type: "tinyint", default: false })
  emailVerified: boolean;

  @Column({ name: "phone_number", type: "varchar", nullable: true })
  phoneNumber: string;

  @Column({ name: "phone_verified", type: "tinyint", default: false })
  phoneVerified: boolean;

  @Column({ name: "full_name", type: "varchar" })
  fullName: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(id: number, username: string, passwordHash: string, email: string, fullName: string) {
    const player = new Player();
    player.id = id;
    player.username = username;
    player.passwordHash = passwordHash;
    player.email = email;
    player.fullName = fullName;
    return player;
  }

}
