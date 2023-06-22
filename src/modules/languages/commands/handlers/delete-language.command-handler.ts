import { Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../../../commands/i-command-handler';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { GetDeleteLanguageCommand } from '../get-delete-language.command';

@Injectable()
export class DeleteLanguageCommandHandler
  implements ICommandHandler<GetDeleteLanguageCommand, void>
{
  constructor(@InjectModel() private readonly connection: Knex) {}

  async execute(command: GetDeleteLanguageCommand): Promise<void> {
    await this.connection('languages')
      .where('_id', command.id)
      .andWhere('can_delete', 1)
      .del();
  }
}
