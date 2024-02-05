import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { join } from "path";
import { APP_FILTER } from "@nestjs/core";
import { MicroserviceRcpExceptionFilter } from "./exception/rcp-exception.filter";
import { LanguageService } from "./service/language.service";
import { LanguageKey } from "./model/language-key.entity";
import { LanguageValue } from "./model/language-value.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(__dirname, "../..", `.env.${process.env.NODE_ENV}`), ".env"],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>("MYSQL_TYPE") === "mysql" ? "mysql" : undefined,
        host: configService.get<string>("MYSQL_HOST"),
        port: configService.get<number>("MYSQL_PORT"),
        username: configService.get<string>("MYSQL_USERNAME"),
        password: configService.get<string>("MYSQL_PASSWORD"),
        database: configService.get<string>("MYSQL_DATABASE"),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>("MYSQL_SYNCHRONIZE"),
      }),
      dataSourceFactory: async (options) => {
        return await new DataSource(options).initialize();
      },
    }),
    TypeOrmModule.forFeature([LanguageKey, LanguageValue]),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MicroserviceRcpExceptionFilter,
    },
    LanguageService,
  ],
  exports: [LanguageService],
})
export class CommonModule {}
