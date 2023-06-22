import { ICommandHandler } from "../../../../commands/i-command-handler";
import { LanguageFilter } from "../../contracts/filter/language.filter";
import { LanguagesInterface } from "../../contracts/models/languages.interface";
import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";

@Injectable()
export class GetLanguagesListCommandsHandler implements ICommandHandler<LanguageFilter, Array<LanguagesInterface>>{
  constructor(@InjectModel() private readonly connection: Knex) {
  }
  async execute(command: LanguageFilter): Promise<LanguagesInterface[]> {
    const languages = this.connection.select<LanguagesInterface[]>().from('languages')

    if  (command.limit){
      languages.limit(command.limit)
    }

    return languages

  }

}