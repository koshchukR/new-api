import { Injectable } from '@nestjs/common';
import { LanguagesInterface } from '../contracts/models/languages.interface';
import { GetLanguagesListCommandsHandler } from '../commands/handlers/get-languages-list.commands-handler';
import { LanguageFilter } from '../contracts/filter/language.filter';
import { AddLanguageCommandHandler } from '../commands/handlers/add-language.command-handler';
import { UpdateLanguageCommandHandler } from '../commands/handlers/update-language.command-handler';
import { GetLanguageCommandHandler } from "../commands/handlers/get-language.command-handler";
import { DeleteLanguageCommandHandler } from "../commands/handlers/delete-language.command-handler";

@Injectable()
export class LanguagesService {
  constructor(
    private getLanguagesListCommands: GetLanguagesListCommandsHandler,
    private addLanguageCommandHandler: AddLanguageCommandHandler,
    private updateLanguageCommandHandler: UpdateLanguageCommandHandler,
    private getLanguageCommandHandler: GetLanguageCommandHandler,
    private deleteLanguageCommandHandler: DeleteLanguageCommandHandler,
  ) {}

  getLanguageList(filter: LanguageFilter): Promise<Array<LanguagesInterface>> {
    return this.getLanguagesListCommands.execute(filter);
  }

  getLanguageById(id: number): Promise<LanguagesInterface>{
    return this.getLanguageCommandHandler.execute({id})
  }

  addLanguage(body: LanguagesInterface):Promise<void> {
     return this.addLanguageCommandHandler.execute(body);
  }

  updateLanguage(body: LanguagesInterface):Promise<void> {
     return this.updateLanguageCommandHandler.execute(body);
  }

  deleteLanguage(id: number):Promise<void>{
    return this.deleteLanguageCommandHandler.execute({id})
  }
}
