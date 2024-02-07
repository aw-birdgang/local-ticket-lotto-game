import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {RequestMethod} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

const serverPort = Number(process.env.SERVER_PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix("v1", {
    exclude: [{ path: "api/health", method: RequestMethod.GET }],
  });
  // app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
      .setTitle("Mobile APP API")
      .setDescription("Mobile Application API")
      .setVersion("1.0")
      .addTag("lotto-app-api")
      .addBearerAuth(
          {
            description: "Default JWT Authorization",
            type: "http",
            in: "header",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
          "BearerAuth",
      )
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(serverPort);
  console.log(`Lotto App API is running on: ${await app.getUrl()}`);
}
bootstrap();
