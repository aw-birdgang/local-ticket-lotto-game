import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderType, TransactionType } from "./finance.enum";
import {AssetTransactionDto} from "../dto/asset-transaction.dto";

@Entity("asset_transaction")
export class AssetTransaction {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "buyer_id", type: "int" })
  buyerId: number;

  @Column({ name: "asset_id", type: "int" })
  assetId: number;

  @Column({ name: "transaction_date", type: "datetime" })
  transactionDate: Date;

  @Column({ name: "transaction_type", type: "enum", enum: TransactionType, default: TransactionType.BUY_TICKET })
  transactionType: TransactionType;

  @Column({ name: "amount", type: "int" })
  amount: number;

  @Column({ name: "order_type", type: "enum", enum: OrderType, nullable: true })
  orderType: OrderType;

  @Column({ name: "order_id", type: "varchar", length: 100, nullable: true })
  orderId: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(
    id: number,
    buyerId: number,
    assetId: number,
    transactionDate: Date,
    transactionType: TransactionType,
    amount: number,
    orderType: OrderType,
    orderId: string,
  ) {
    const newClass = new AssetTransaction();
    newClass.id = id;
    newClass.buyerId = buyerId;
    newClass.assetId = assetId;
    newClass.transactionDate = transactionDate;
    newClass.transactionType = transactionType;
    newClass.amount = amount;
    newClass.orderType = orderType;
    newClass.orderId = orderId;
    return newClass;
  }

  toAssetTransactionDto() {
    const newClass = new AssetTransactionDto();
    newClass.id = this.id;
    newClass.buyerId = this.buyerId;
    newClass.assetId = this.assetId;
    newClass.transactionDate = this.transactionDate;
    newClass.transactionType = this.transactionType;
    newClass.amount = this.amount;
    newClass.orderType = this.orderType;
    newClass.orderId = this.orderId;
    return newClass;
  }
}
