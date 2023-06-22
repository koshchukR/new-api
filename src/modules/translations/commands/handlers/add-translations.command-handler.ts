import { Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../../../commands/i-command-handler';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { AddLanguageCommand } from '../add-language.command';
import { LanguagesInterface } from '../../../languages/contracts/models/languages.interface';

@Injectable()
export class AddTranslationsCommandHandler
  implements ICommandHandler<AddLanguageCommand, void>
{
  constructor(@InjectModel() private readonly connection: Knex) {}

  async execute(command: AddLanguageCommand): Promise<void> {


      const { _id: languages_id } = await this.connection
          .select<LanguagesInterface>('_id')
          .from('languages')
          .where('lang_short', command.language)
          .first();


    await this.connection('translations')
      .where('languages_id', languages_id)
      .del();


    await this.connection
      .insert(
        command.language_list.map((value) => ({
          ...value,
          languages_id,
        }))
      )
      .into('translations');
  }
}
