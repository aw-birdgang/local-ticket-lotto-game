import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {RequestMethod} from "@nestjs/common";
import {initializeTransactionalContext, StorageDriver} from "./common/transaction";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";


function getMicroserviceOptions(transport: Transport) {
  if (transport === Transport.TCP) {
    return getTcpMicroserviceOptions();
  } else if (transport === Transport.KAFKA) {
    return getKafkaMicroserviceOptions();
  } else {
    return {}
  }
}

function getTcpMicroserviceOptions() {
  return {
    transport: Transport.TCP,
    options: {
      host: process.env.SOCKET_HOST,
      port: Number(process.env.SOCKET_PORT)
    }
  }
}

function getKafkaMicroserviceOptions() {
  let clientConfig = {
    clientId: process.env.KAFKA_CLIENT_PREFIX,
    brokers: process.env.KAFKA_BROKER_URL.split(",").sort(() => Math.random() - 0.5)
  }
  if (process.env.NODE_ENV !== "local") {
    clientConfig = {...clientConfig,
      // ssl: true,
      // sasl: {
      //   mechanism: "oauthbearer",
      //   oauthBearerProvider: () => oauthBearerTokenProvider("ap-southeast-1")
      // }
    };
  }
  return {
    transport: Transport.KAFKA,
    options: {
      client: clientConfig,
      consumer: {
        groupId: process.env.KAFKA_CONSUMER_GROUP_PREFIX
      }
    }
  }
}

async function bootstrap() {
  // @Transactional 사용시 초기 Nest Context 작업 가동
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix("v1", {
    exclude: [{ path: "api/health", method: RequestMethod.GET }]
  });

  app.connectMicroservice<MicroserviceOptions>(getMicroserviceOptions(Transport.KAFKA));
  await app.startAllMicroservices();
  await app.listen(Number(process.env.SERVER_PORT));
}
bootstrap();
