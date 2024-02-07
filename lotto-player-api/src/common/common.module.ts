import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {join} from "path";
import {APP_FILTER} from "@nestjs/core";
import {MicroserviceHttpExceptionFilter} from "./exception/microservice-http-exception.filter";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {TerminusModule} from "@nestjs/terminus";
import {KafkaServer} from "./microservice/microservice.enum";
import {AccountKafkaClientService} from "./microservice/kafka-account-client-service";
import {GameKafkaClientService} from "./microservice/kafka-game-client-service";
import {AuthKafkaClientService} from "./microservice/kafka-auth-client-service";
import {generateAuthToken} from "aws-msk-iam-sasl-signer-js";

async function oauthBearerTokenProvider(region: string): Promise<{ value: string }> {
  const authTokenResponse = await generateAuthToken({ region });
  return {
    value: authTokenResponse.token
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(__dirname, "../..", `.env.${process.env.NODE_ENV}`), ".env"],
      isGlobal: true,
      cache: true,
    }),
    ClientsModule.registerAsync([
      // {
      //   imports: [ConfigModule],
      //   name: TcpServer.TCP_AUTH_SERVER,
      //   useFactory: (configService: ConfigService) => ({
      //     transport: Transport.TCP,
      //     options: {
      //       host: configService.get<string>("AUTH_SOCKET_HOST"),
      //       port: configService.get<number>("AUTH_SOCKET_PORT"),
      //     },
      //   }),
      //   inject: [ConfigService],
      // },
      // {
      //   imports: [ConfigModule],
      //   name: TcpServer.TCP_ACCOUNT_SERVER,
      //   useFactory: (configService: ConfigService) => ({
      //     transport: Transport.TCP,
      //     options: {
      //       host: configService.get<string>("ACCOUNT_SOCKET_HOST"),
      //       port: configService.get<number>("ACCOUNT_SOCKET_PORT"),
      //     },
      //   }),
      //   inject: [ConfigService],
      // },
      // {
      //   imports: [ConfigModule],
      //   name: TcpServer.TCP_GAME_SERVER,
      //   useFactory: (configService: ConfigService) => ({
      //     transport: Transport.TCP,
      //     options: {
      //       host: configService.get<string>("GAME_SOCKET_HOST"),
      //       port: configService.get<number>("GAME_SOCKET_PORT"),
      //     },
      //   }),
      //   inject: [ConfigService],
      // },
      {
        imports: [ConfigModule],
        name: KafkaServer.KAFKA_AUTH_SERVER,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>("KAFKA_AUTH_CLIENT_PREFIX"),
              brokers: configService.get<string>("KAFKA_BROKER_URL").split(",").sort(() => Math.random() - 0.5),
              // ssl: true,
              // sasl: {
              //   mechanism: "oauthbearer",
              //   oauthBearerProvider: () => oauthBearerTokenProvider("ap-southeast-1")
              // }
            },
            consumer: {
              groupId: configService.get<string>("KAFKA_AUTH_CONSUMER_GROUP_PREFIX"),
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: KafkaServer.KAFKA_ACCOUNT_SERVER,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>("KAFKA_ACCOUNT_CLIENT_PREFIX"),
              brokers: configService.get<string>("KAFKA_BROKER_URL").split(",").sort(() => Math.random() - 0.5),
              // ssl: true,
              // sasl: {
              //   mechanism: "oauthbearer",
              //   oauthBearerProvider: () => oauthBearerTokenProvider("ap-southeast-1")
              // }
            },
            consumer: {
              groupId: configService.get<string>("KAFKA_ACCOUNT_CONSUMER_GROUP_PREFIX"),
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: KafkaServer.KAFKA_GAME_SERVER,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.get<string>("KAFKA_GAME_CLIENT_PREFIX"),
              brokers: configService.get<string>("KAFKA_BROKER_URL").split(",").sort(() => Math.random() - 0.5),
              // ssl: true,
              // sasl: {
              //   mechanism: "oauthbearer",
              //   oauthBearerProvider: () => oauthBearerTokenProvider("ap-southeast-1")
              // }
            },
            consumer: {
              groupId: configService.get<string>("KAFKA_GAME_CONSUMER_GROUP_PREFIX"),
            },
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
      useClass: MicroserviceHttpExceptionFilter,
    },
    // AuthTcpClientService,
    // AccountTcpClientService,
    // GameTcpClientService,
    AuthKafkaClientService,
    AccountKafkaClientService,
    GameKafkaClientService,
  ],
  exports: [AuthKafkaClientService, AccountKafkaClientService, GameKafkaClientService],
})
export class CommonModule {
}
