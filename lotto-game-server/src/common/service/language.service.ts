import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { LanguageKey } from "../model/language-key.entity";
import { LanguageValue } from "../model/language-value.entity";
import { LanguageKeyValueDto } from "../model/language-key-value.dto";
import { isEmpty } from "class-validator";
import { BusinessException } from "../exception/business-exception";
import { ErrorCodes } from "../exception/error.enum";
import { LanguageCode } from "../model/common.enum";

@Injectable()
export class LanguageService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(LanguageKey) private languageKeyRepository: Repository<LanguageKey>,
    @InjectRepository(LanguageValue) private languageValueRepository: Repository<LanguageValue>,
  ) {}

  findLanguageKeyById(languageId: number): Promise<LanguageKey> {
    return this.languageKeyRepository.findOneBy({ languageId });
  }

  saveLanguageKey(languageId: number, tableName: string, columnName: string) {
    return this.languageKeyRepository.save(LanguageKey.from(languageId, tableName, columnName));
  }

  findLanguageValueById(languageId: number, languageCode: LanguageCode) {
    return this.languageValueRepository.findOneBy({ languageId, languageCode });
  }

  saveLanguageValue(languageId: number, languageCode: LanguageCode, text: string) {
    return this.languageValueRepository.save(LanguageValue.from(languageId, languageCode, text));
  }

  findLanguageKeyValueById(languageId: number, languageCode: LanguageCode): Promise<LanguageKeyValueDto> {
    return this.entityManager
      .createQueryBuilder(LanguageValue, "lv")
      .innerJoinAndSelect(LanguageKey, "lk", "lk.languageId = lv.languageId")
      .select("lv.language_id", "languageId")
      .addSelect("lk.column_id", "columnId")
      .addSelect("lv.language_code", "languageCode")
      .addSelect("lv.text", "text")
      .where("lk.language_id = :languageId", { languageId })
      .andWhere("lk.language_code = :languageCode", { languageCode })
      .getRawOne();
  }

  async saveLanguageKeyValue(languageId: number, tableName: string, columnName: string, languageCode: LanguageCode, text: string) {
    if (isEmpty(languageId) || languageId == 0) {
      const languageKeyResult = await this.languageKeyRepository.insert(LanguageKey.from(null, tableName, columnName));
      // console.log("saveLanguageKeyValue  languageKeyResult -> ", languageKeyResult);
      if (isEmpty(languageKeyResult) || isEmpty(languageKeyResult.identifiers) || isEmpty(languageKeyResult.identifiers[0])) {
        throw new BusinessException(ErrorCodes.BUS_ERROR_008);
      }
      languageId = languageKeyResult.identifiers[0]["languageId"];
      const languageValueResult = await this.languageValueRepository.insert(LanguageValue.from(languageId, languageCode, text));
      // console.log("saveLanguageKeyValue  languageValueResult -> ", languageValueResult);
      if (isEmpty(languageValueResult) || isEmpty(languageValueResult.identifiers) || isEmpty(languageValueResult.identifiers[0])) {
        throw new BusinessException(ErrorCodes.BUS_ERROR_008);
      }
      return LanguageKeyValueDto.from(languageId, tableName, columnName, languageCode, text);
    } else {
      const languageValueResult = await this.languageValueRepository.update({ languageId, languageCode }, { text });
      // console.log("saveLanguageKeyValue  languageValueResult -> ", languageValueResult);
      if (isEmpty(languageValueResult) || languageValueResult.affected <= 0) {
        throw new BusinessException(ErrorCodes.BUS_ERROR_009);
      }
      return LanguageKeyValueDto.from(languageId, tableName, columnName, languageCode, text);
    }
  }
}
