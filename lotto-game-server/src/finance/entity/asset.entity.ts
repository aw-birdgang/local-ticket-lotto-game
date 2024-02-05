import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AssetType } from "./finance.enum";
import {AssetDto} from "../dto/asset.dto";

@Entity("asset")
@Index("uk1_asset", ["ownerId", "assetType"], { unique: true })
export class Asset {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "asset_type", type: "enum", enum: AssetType, default: AssetType.USD })
  assetType: AssetType;

  @Column({ name: "owner_id", type: "int" })
  ownerId: number;

  @Column({ name: "balance", type: "int" })
  balance: number;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(id: number, assetType: AssetType, ownerId: number, balance: number) {
    const newClass = new Asset();
    newClass.id = id;
    newClass.assetType = assetType;
    newClass.ownerId = ownerId;
    newClass.balance = balance;
    return newClass;
  }

  toAssetDto() {
    const newClass = new AssetDto();
    newClass.id = this.id;
    newClass.assetType = this.assetType;
    newClass.ownerId = this.ownerId;
    newClass.balance = this.balance;
    return newClass;
  }
}
