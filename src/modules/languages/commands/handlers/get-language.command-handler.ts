import { Injectable } from '@nestjs/common';
import { ICommandHandler } from '../../../../commands/i-command-handler';
import { LanguagesInterface } from '../../contracts/models/languages.interface';
import { GetDeleteLanguageCommand } from '../get-delete-language.command';
import { Repository } from 'typeorm';
import { LanguagesEntity } from '../../../../entity/language.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GetLanguageCommandHandler
  implements ICommandHandler<GetDeleteLanguageCommand, LanguagesInterface>
{
  constructor(
    @InjectRepository(LanguagesEntity)
    private languageRepository: Repository<LanguagesEntity>,
  ) {}

  async execute(
    command: GetDeleteLanguageCommand,
  ): Promise<LanguagesInterface> {
    return this.languageRepository.findOneBy({ _id: command.id });
  }
}
