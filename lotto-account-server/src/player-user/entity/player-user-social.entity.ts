import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { PlayerUserSocialDto } from "../dto/player-user-social.dto";

@Entity("player_user_social")
// @Index("uk1_admin_user", ["username"], { unique: true })
export class PlayerUserSocial {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "social_type", type: "varchar" })
  socialType: string;

  @Column({ name: "username", type: "varchar" })
  username: string;

  @Column({ name: "email", type: "varchar", length: 100 })
  @Unique(["email"])
  email: string;

  @Column({ name: "access_token", type: "varchar", length: 300 })
  accessToken: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(id: number, username: string, email: string, socialType: string, accessToken: string) {
    const newClass = new PlayerUserSocial();
    newClass.id = id;
    newClass.socialType = socialType;
    newClass.username = username;
    newClass.email = email;
    newClass.accessToken = accessToken;
    return newClass;
  }

  toPlayerUserSocialDto() {
    const newClass = new PlayerUserSocialDto();
    newClass.id = this.id;
    newClass.socialType = this.socialType;
    newClass.username = this.username;
    newClass.email = this.email;
    newClass.accessToken = this.accessToken;
    return newClass;
  }
}
