import { Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../../../commands/i-command-handler';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { LanguagesInterface } from '../../contracts/models/languages.interface';
import { GetDeleteLanguageCommand } from '../get-delete-language.command';

@Injectable()
export class GetLanguageCommandHandler
  implements ICommandHandler<GetDeleteLanguageCommand, LanguagesInterface>
{
  constructor(@InjectModel() private readonly connection: Knex) {}

  async execute(command: GetDeleteLanguageCommand): Promise<LanguagesInterface> {
    return  this.connection
      .select<LanguagesInterface>()
      .from('languages')
      .where('_id', command.id)
      .first();
  }
}
