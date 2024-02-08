import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./exception/http-exception.filter";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { TcpServices } from "./microservice/MicroserviceTcpClient";
import { TcpClientService } from "./microservice/TcpClientService";
import { TerminusModule } from "@nestjs/terminus";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(__dirname, "../..", `.env.${process.env.NODE_ENV}`), ".env"],
      isGlobal: true,
      cache: true,
    }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: TcpServices.LOTTO_GAME_SERVER,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>("SOCKET_HOST"),
            port: configService.get<number>("SOCKET_PORT"),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TerminusModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    TcpClientService,
  ],
  exports: [TcpClientService],
})
export class CommonModule {}
