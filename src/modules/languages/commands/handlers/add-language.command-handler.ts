import { ICommandHandler } from '../../../../commands/i-command-handler';
import { Inject, Injectable } from "@nestjs/common";
import { Knex } from 'knex';
import { LanguagesInterface } from "../../contracts/models/languages.interface";
import { InjectModel } from "nest-knexjs";

@Injectable()
export class AddLanguageCommandHandler implements ICommandHandler<LanguagesInterface, void> {
  constructor(@InjectModel() private readonly connection: Knex) {}

  async execute(command: LanguagesInterface): Promise<void> {
    await this.connection.insert(command).into('languages')
  }
}
