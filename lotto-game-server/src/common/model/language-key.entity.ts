import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("language_key")
export class LanguageKey {
  @PrimaryGeneratedColumn({ name: "language_id", type: "int" })
  languageId: number;

  @Column({ name: "table_name", type: "varchar", length: 50 })
  tableName: string;

  @Column({ name: "column_name", type: "varchar", length: 50 })
  columnName: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(languageId: number, tableName: string, columnName: string) {
    const languageKey = new LanguageKey();
    languageKey.languageId = languageId;
    languageKey.tableName = tableName;
    languageKey.columnName = columnName;
    return languageKey;
  }
}
