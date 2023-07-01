import { ICommandHandler } from '../../../../commands/i-command-handler';
import { LanguageFilter } from '../../contracts/filter/language.filter';
import { LanguagesInterface } from '../../contracts/models/languages.interface';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LanguagesEntity } from '../../../../entity/language.entity';
import { TranslationsEntity } from '../../../../entity/translation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetLanguagesListCommandsHandler
  implements ICommandHandler<LanguageFilter, Array<LanguagesInterface>>
{
  constructor(
    @InjectRepository(LanguagesEntity)
    private languageRepository: Repository<LanguagesEntity>,
    @InjectRepository(TranslationsEntity)
    private translationRepository: Repository<TranslationsEntity>,
  ) {}

  async execute(command: LanguageFilter): Promise<LanguagesInterface[]> {
    // Create the subquery for "total"
    const totalSubQuery = this.translationRepository
      .createQueryBuilder('t')
      .select('COUNT(t._id)')
      .where('t.languages_id = 1')
      .getQuery();

    // Main query
    return await this.languageRepository
      .createQueryBuilder('languages')
      .select([
        'languages._id as _id',
        'languages.language as language',
        'languages.lang_short as lang_short',
        'languages.can_delete as can_delete',
        'COUNT(translations._id) AS items',
        `(${totalSubQuery}) as total`,
      ])
      .leftJoin(
        TranslationsEntity,
        'translations',
        'translations.languages_id = languages._id',
      )
      .groupBy('languages._id')
      .addGroupBy('languages.language')
      .addGroupBy('languages.lang_short')
      .addGroupBy('languages.can_delete')
      .getRawMany();
  }
}
