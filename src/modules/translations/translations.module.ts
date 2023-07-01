import { Module } from '@nestjs/common';
import { TranslationsController } from './controllers/translations.controller';
import { TranslationsService } from './services/translations.service';
import { AddTranslationsCommandHandler } from './commands/handlers/add-translations.command-handler';
import { GetTranslationsCommandHandler } from './commands/handlers/get-translations.command-handler';
import { GetLanguageCommandHandler } from '../languages/commands/handlers/get-language.command-handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsEntity } from '../../entity/translation.entity';
import { LanguagesEntity } from '../../entity/language.entity';

@Module({
  controllers: [TranslationsController],
  providers: [
    TranslationsService,
    AddTranslationsCommandHandler,
    GetTranslationsCommandHandler,
    GetLanguageCommandHandler,
  ],
  imports: [TypeOrmModule.forFeature([TranslationsEntity, LanguagesEntity])],
})
export class TranslationsModule {}
