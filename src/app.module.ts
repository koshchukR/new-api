import { Module } from '@nestjs/common';
import { LanguagesModule } from './modules/languages/languages.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'process';
import { TypeOrmModule } from '@nestjs/typeorm';

const config: any = (): string => {
  let env;
  switch (process.env.NODE_ENV) {
    case 'dev':
      env = 'env/.env.dev';
      break;
    case 'stage':
      env = 'env/.env.stag';
      break;
    case 'prod':
      env = 'env/.env.prod';
      break;
    default:
      env = 'env/.env';
  }
  return env;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: config(),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/entity/*.entity{.ts,.js}'],
        logging: configService.get<string>('DEBUG') == 'true',
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    LanguagesModule,
    TranslationsModule,
  ],
})
export class AppModule {}
