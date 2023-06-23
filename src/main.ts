import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from "@nestjs/config";
import { loggerMiddleware } from "./middleware/logging.middleware";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(loggerMiddleware);
    const configService = app.get(ConfigService);
    const PORT = configService.get('PORT');

    await app.listen(PORT, () => {
    });
}

bootstrap();
