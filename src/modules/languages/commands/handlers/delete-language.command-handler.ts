import { Inject, Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../../../commands/i-command-handler';
import { GetDeleteLanguageCommand } from '../get-delete-language.command';
import { Repository } from 'typeorm';
import { LanguagesEntity } from '../../../../entity/language.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DeleteLanguageCommandHandler
  implements ICommandHandler<GetDeleteLanguageCommand, void>
{
  constructor(
    @InjectRepository(LanguagesEntity)
    private languageRepository: Repository<LanguagesEntity>,
  ) {}

  async execute(command: GetDeleteLanguageCommand): Promise<void> {
    this.languageRepository
      .createQueryBuilder('languages')
      .delete()
      .where('_id = :id', { id: command.id })
      .andWhere('can_delete = true');
  }
}
