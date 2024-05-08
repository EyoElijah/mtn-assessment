import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import logger from './common/logger';

config();

async function bootstrap() {
  const app = await NestFactory.create<INestApplication>(AppModule);

  const config: ConfigService = app.get(ConfigService);
  const port = +config.get<number>('PORT') || 3000;

  // cors allow http client such as a browser to make trusted communication with the server
  app.enableCors();
  app.use(helmet());
  app.setGlobalPrefix('v1');

  // global validation to catch invalid URI and return with a 404 exception (error)
  app.useGlobalPipes(new ValidationPipe());

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Todo List Application')
    .setDescription('Api for Todo List Application')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`, 'Local Development Server')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  logger
    .info(`Application is running on http://localhost:${port}/v1`)
    .console();
  logger.info(`docs can be found on http://localhost:${port}/docs`).console();
}
bootstrap();
