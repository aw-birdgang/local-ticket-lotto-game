import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlayerUserDto } from "../dto/player-user.dto";

@Entity("player_user")
@Index("uk1_player_user", ["username"], { unique: true })
export class PlayerUser {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "username", type: "varchar" })
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
    const newClass = new PlayerUser();
    newClass.id = id;
    newClass.username = username;
    newClass.passwordHash = passwordHash;
    newClass.email = email;
    newClass.fullName = fullName;
    return newClass;
  }

  toPlayerUserDto() {
    const newClass = new PlayerUserDto();
    newClass.id = this.id;
    newClass.username = this.username;
    newClass.email = this.email;
    newClass.emailVerified = this.emailVerified;
    newClass.phoneNumber = this.phoneNumber;
    newClass.phoneVerified = this.phoneVerified;
    newClass.fullName = this.fullName;
    return newClass;
  }
}
