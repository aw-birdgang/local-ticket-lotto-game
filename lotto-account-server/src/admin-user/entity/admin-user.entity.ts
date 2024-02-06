import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AdminUserDto } from "../dto/admin-user.dto";

@Entity("admin_user")
@Index("uk1_admin_user", ["username"], { unique: true })
export class AdminUser {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "username", type: "varchar" })
  username: string;

  @Column({ name: "password_hash", type: "varchar", length: 200 })
  passwordHash: string;

  @Column({ name: "company_id", type: "bigint", nullable: true })
  companyId: number;

  @Column({ name: "email", type: "varchar", length: 100 })
  email: string;

  @Column({ name: "email_verified", type: "tinyint", nullable: true })
  emailVerified: boolean;

  @Column({ name: "phone_number", type: "varchar", nullable: true })
  phoneNumber: string;

  @Column({ name: "phone_verified", type: "tinyint", nullable: true })
  phoneVerified: boolean;

  @Column({ name: "full_name", type: "varchar", nullable: true })
  fullName: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(id: number, username: string, passwordHash: string, companyId: number, email: string, fullName: string) {
    const adminUser = new AdminUser();
    adminUser.id = id;
    adminUser.username = username;
    adminUser.passwordHash = passwordHash;
    adminUser.companyId = companyId;
    adminUser.email = email;
    adminUser.fullName = fullName;
    return adminUser;
  }

  toAdminUserDto() {
    const adminUserDto = new AdminUserDto();
    adminUserDto.id = this.id;
    adminUserDto.username = this.username;
    adminUserDto.companyId = this.companyId;
    adminUserDto.email = this.email;
    adminUserDto.emailVerified = this.emailVerified;
    adminUserDto.phoneNumber = this.phoneNumber;
    adminUserDto.phoneVerified = this.phoneVerified;
    adminUserDto.fullName = this.fullName;
    return adminUserDto;
  }
}
