import { ICommandHandler } from '../../../../commands/i-command-handler';
import { Injectable } from '@nestjs/common';
import { LanguagesInterface } from '../../contracts/models/languages.interface';
import { Repository } from 'typeorm';
import { LanguagesEntity } from '../../../../entity/language.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UpdateLanguageCommandHandler
  implements ICommandHandler<LanguagesInterface, void>
{
  constructor(
    @InjectRepository(LanguagesEntity)
    private languageRepository: Repository<LanguagesEntity>,
  ) {}

  async execute(command: LanguagesInterface): Promise<void> {
    const language = await this.languageRepository.findOneBy({
      _id: command._id,
      can_delete: true,
    });

    if (!language) {
      throw new Error('Language not found;');
    }

    await this.languageRepository
      .createQueryBuilder()
      .update(LanguagesEntity)
      .set({
        language: command.language,
        lang_short: command.lang_short,
      })
      .where('_id = :id', { id: command._id });
  }
}
