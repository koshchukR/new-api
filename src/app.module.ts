import { Module } from "@nestjs/common";
import { KnexModule } from "nest-knexjs";
import { LanguagesModule } from "./modules/languages/languages.module";
import { TranslationsModule } from "./modules/translations/translations.module";

@Module({
  imports: [
      KnexModule.forRoot({
    config:{
      client: 'mysql',
      useNullAsDefault: true,
      connection:{
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'mysql_x24',
      }
    }
  }),
    LanguagesModule,
    TranslationsModule
  ]
})
export class AppModule {}