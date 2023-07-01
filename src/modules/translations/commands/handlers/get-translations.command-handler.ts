import { Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../../../commands/i-command-handler';
import { AddLanguageCommand } from '../add-language.command';
import { TranslationInterface } from '../../contracts/models/translation.interface';
import { Repository } from 'typeorm';
import { TranslationsEntity } from '../../../../entity/translation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetTranslationsCommandHandler
  implements ICommandHandler<any, any>
{
  constructor(
    @InjectRepository(TranslationsEntity)
    private translationRepository: Repository<TranslationsEntity>,
  ) {}

  execute(command: AddLanguageCommand): Promise<Array<TranslationInterface>> {
    return this.translationRepository
      .createQueryBuilder('t')
      .select(['t.key as key', 't.value as value'])
      .leftJoinAndSelect('t.languages', 'languages')
      .where('languages.lang_short = :lang_short', {
        lang_short: command.language,
      })
      .getMany() as any;
  }
}
