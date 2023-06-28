import { ICommandHandler } from '../../../../commands/i-command-handler';
import { LanguageFilter } from '../../contracts/filter/language.filter';
import { LanguagesInterface } from '../../contracts/models/languages.interface';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';

@Injectable()
export class GetLanguagesListCommandsHandler
  implements ICommandHandler<LanguageFilter, Array<LanguagesInterface>>
{
  constructor(@InjectModel() private readonly connection: Knex) {}

  async execute(command: LanguageFilter): Promise<LanguagesInterface[]> {
    const total = await this.connection
      .count('_id as count')
      .from('translations')
      .where(this.connection.raw('languages_id = ?', [1]))
      .first()
      .then((value: { count: number }) => value.count);

    const languages = this.connection
      .select<LanguagesInterface[]>([
        'l.*',
        this.connection.raw(`'${total}' as total`),
      ])
      .count(' t._id as items')
      .from('languages as l')
      .leftJoin('translations as t', 't.languages_id', 'l._id')
      .groupBy(['l._id', 'l.can_delete', 'l.lang_short', 'l.language']);

    if (command.limit) {
      languages.limit(command.limit);
    }

    return languages as any;
  }
}
