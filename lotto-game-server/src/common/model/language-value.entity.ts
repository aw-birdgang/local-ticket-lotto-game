import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { LanguageCode } from "./common.enum";

@Entity("language_value")
export class LanguageValue {
  @PrimaryColumn({ name: "language_id", type: "int" })
  languageId: number;

  @PrimaryColumn({ name: "language_code", type: "enum", enum: LanguageCode })
  languageCode: LanguageCode;

  @Column({ name: "text", type: "varchar", length: 1000 })
  text: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  static from(languageId: number, languageCode: LanguageCode, text: string) {
    const languageValue = new LanguageValue();
    languageValue.languageId = languageId;
    languageValue.languageCode = languageCode;
    languageValue.text = text;
    return languageValue;
  }
}
