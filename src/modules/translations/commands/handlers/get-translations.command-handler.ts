import { Injectable } from "@nestjs/common";
import { ICommandHandler } from "../../../../commands/i-command-handler";
import { InjectModel } from "nest-knexjs";
import { Knex } from "knex";
import { AddLanguageCommand } from "../add-language.command";
import { TranslationInterface } from "../../contracts/models/translation.interface";

@Injectable()
export class GetTranslationsCommandHandler implements ICommandHandler<any, any> {
    constructor(@InjectModel() private readonly connection: Knex) {
    }

    execute(command: AddLanguageCommand): Promise<Array<TranslationInterface>> {
        return this.connection
            .select(['t.key', 't.value'])
            .from('translations as t')
            .leftJoin('languages as l', 'l._id', 't.languages_id')
            .where('l.lang_short', command.language)
    }

}