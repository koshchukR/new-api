import { Module } from '@nestjs/common';
import { LanguagesService } from './services/languages.service';
import { LanguagesController } from './controllers/languages.controller';
import { AddLanguageCommandHandler } from './commands/handlers/add-language.command-handler';
import { GetLanguagesListCommandsHandler } from './commands/handlers/get-languages-list.commands-handler';
import { UpdateLanguageCommandHandler } from './commands/handlers/update-language.command-handler';
import { GetLanguageCommandHandler } from './commands/handlers/get-language.command-handler';
import { DeleteLanguageCommandHandler } from './commands/handlers/delete-language.command-handler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsEntity } from '../../entity/translation.entity';
import { LanguagesEntity } from '../../entity/language.entity';

@Module({
  providers: [
    LanguagesService,
    GetLanguagesListCommandsHandler,
    AddLanguageCommandHandler,
    UpdateLanguageCommandHandler,
    GetLanguageCommandHandler,
    DeleteLanguageCommandHandler,
  ],
  controllers: [LanguagesController],
  imports: [TypeOrmModule.forFeature([TranslationsEntity, LanguagesEntity])],
})
export class LanguagesModule {}
