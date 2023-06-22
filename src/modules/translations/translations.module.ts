import { Module } from '@nestjs/common';
import { TranslationsController } from "./controllers/translations.controller";
import { TranslationsService } from "./services/translations.service";
import { AddLanguagesCommandHandler } from "./commands/handlers/add-languages.command-handler";

@Module({
    controllers: [TranslationsController],
    providers: [
        TranslationsService,
        AddLanguagesCommandHandler
    ]
})
export class TranslationsModule {
}
