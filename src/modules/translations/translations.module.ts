import { Module } from '@nestjs/common';
import { TranslationsController } from "./controllers/translations.controller";
import { TranslationsService } from "./services/translations.service";
import { AddTranslationsCommandHandler } from "./commands/handlers/add-translations.command-handler";
import { GetTranslationsCommandHandler } from "./commands/handlers/get-translations.command-handler";

@Module({
    controllers: [TranslationsController],
    providers: [
        TranslationsService,
        AddTranslationsCommandHandler,
        GetTranslationsCommandHandler
    ]
})
export class TranslationsModule {
}
