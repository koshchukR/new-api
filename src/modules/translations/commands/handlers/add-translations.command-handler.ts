import { Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../../../commands/i-command-handler';
import { AddLanguageCommand } from '../add-language.command';
import { Repository } from 'typeorm';
import { LanguagesEntity } from '../../../../entity/language.entity';
import { TranslationsEntity } from '../../../../entity/translation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AddTranslationsCommandHandler
  implements ICommandHandler<AddLanguageCommand, void>
{
  constructor(
    @InjectRepository(LanguagesEntity)
    private languageRepository: Repository<LanguagesEntity>,
    @InjectRepository(TranslationsEntity)
    private translationRepository: Repository<TranslationsEntity>,
  ) {}

  async execute(command: AddLanguageCommand): Promise<void> {
    const language = await this.languageRepository.findOne({
      where: { lang_short: command.language },
    });

    await this.translationRepository
      .createQueryBuilder()
      .delete()
      .from(TranslationsEntity)
      .where('languages_id = :languages_id', { languages_id: language._id })
      .execute();

    const some = command.language_list.map((value) => ({
      ...value,
      languages: language,
    }));

    await this.translationRepository
      .createQueryBuilder('translations')
      .insert()
      .into(TranslationsEntity)
      .values(some)
      .execute();
  }
}
