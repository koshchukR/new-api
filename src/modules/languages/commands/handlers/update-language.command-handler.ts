import { ICommandHandler } from '../../../../commands/i-command-handler';
import { Inject, Injectable } from "@nestjs/common";
import { Knex } from 'knex';
import { LanguagesInterface } from '../../contracts/models/languages.interface';
import { InjectModel } from "nest-knexjs";

@Injectable()
export class UpdateLanguageCommandHandler
  implements ICommandHandler<LanguagesInterface, void>
{
  constructor(@InjectModel() private readonly connection: Knex) {}

  async execute(command: LanguagesInterface): Promise<void> {
    const language = await this.connection
      .select()
      .from('languages')
      .where('_id', command._id).first<LanguagesInterface>();
    if (!language) {
      throw new Error('Language not found;');
    }
    const newLanguage: LanguagesInterface = {
      language: command.language,
      lang_short: command.lang_short,
    };

    await this.connection.table('languages').update(newLanguage).where({ _id: command._id });
  }
}
