import { ICommandHandler } from '../../../../commands/i-command-handler';
import { Inject, Injectable } from '@nestjs/common';
import { LanguagesInterface } from '../../contracts/models/languages.interface';
import { Repository } from 'typeorm';
import { LanguagesEntity } from '../../../../entity/language.entity';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AddLanguageCommandHandler
  implements ICommandHandler<LanguagesInterface, void>
{
  constructor(
    @InjectRepository(LanguagesEntity) private languageRepository: Repository<LanguagesEntity>,
  ) {}

  async execute(command: LanguagesInterface): Promise<void> {
    const language = new LanguagesEntity();
    language.language = command.language;
    language.lang_short = command.lang_short;
    await this.languageRepository.save(language);
  }
}
