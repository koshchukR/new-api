import { Module } from '@nestjs/common';
import { LanguagesModule } from './modules/languages/languages.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as process from 'process';
import { KnexModule } from 'nest-knexjs';

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
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: {
          debug: configService.get<string>('DEBUG') == 'true',
          client: configService.get<string>('CLIENT'),
          connection: {
            port: configService.get<string>('DB_PORT'),
            host: configService.get<string>('DB_HOST'),
            user: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_DATABASE'),
          },
          useNullAsDefault: true,
          pool: { min: 2, max: 20 },
          log: {
            warn(message) {
              console.warn(message);
            },
            error(message) {
              console.error(message);
            },
            deprecate(message) {
              console.warn(message);
            },
            debug(message) {
              console.debug(
                `[SQL]: ${message.sql}\r\nPARAMS: ${(
                  message.bindings || []
                ).join(', ')}`,
              );
            },
          },
          migrations: {
            directory: './migrations',
          },
        },
      }),
      inject: [ConfigService],
    }),
    LanguagesModule,
    TranslationsModule,
  ],
})
export class AppModule {}
