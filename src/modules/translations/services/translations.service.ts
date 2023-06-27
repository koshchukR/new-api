import { Injectable } from '@nestjs/common';
import { iFile } from "../commands/add-language.command";
import { AddTranslationsCommandHandler } from "../commands/handlers/add-translations.command-handler";
import { GetTranslationsCommandHandler } from "../commands/handlers/get-translations.command-handler";
import { FileFormationHelper } from '../helpers/file-formation.helper'
import * as yaml from 'js-yaml';


@Injectable()
export class TranslationsService {
    constructor(private addLanguagesCommandHandler: AddTranslationsCommandHandler,
                private getTranslationsCommandHandler: GetTranslationsCommandHandler) {
    }

    async createUpdateTranslationFile(file: Express.Multer.File, language: string, file_name: string) {
        const type = file_name.split('.').slice(-1)[0]
        let language_list: Array<iFile>
        switch (type) {
            case 'json':
                language_list = FileFormationHelper.parseJsonFile(JSON.parse(file.buffer.toString()));
                break;
            case 'xls':
            case 'xlsx':
                language_list = FileFormationHelper.parseXmlFile(file);
                break;
            case 'yaml':
                 language_list = yaml.load(file.buffer.toString());
                break;
            default:
                throw Error('Format incorrect')
        }
        if (language_list[0])
            await this.addLanguagesCommandHandler.execute({ language_list, language })
    }


    async downloadFile(language, file_name) {
        const type = file_name.split('.').slice(-1)[0]
        const translations = await this.getTranslationsCommandHandler.execute({ language })


        switch (type) {
            case 'json':
                return FileFormationHelper.writeFileJson(translations)
            case 'xlsx':
            case 'xls':
                return FileFormationHelper.writeFileXlsx(translations, language)
            case 'yaml':
                return FileFormationHelper.writeFileYaml(translations)
            default:
                throw Error('Format incorrect')

        }

    }


}

