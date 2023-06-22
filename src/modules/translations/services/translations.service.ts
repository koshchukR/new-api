import { Injectable } from '@nestjs/common';
import { readFile, utils, set_fs, read } from "xlsx";
import { iFile } from "../commands/add-language.command";
import { AddLanguagesCommandHandler } from "../commands/handlers/add-languages.command-handler";

@Injectable()
export class TranslationsService {
    constructor(private addLanguagesCommandHandler: AddLanguagesCommandHandler) {
    }

    async createUpdateTranslationFile(file: Express.Multer.File, language: string, file_name: string) {
        const type = file_name.split('.').slice(-1)[0]
        console.log(type)
        console.log(file.buffer)
        let language_list: Array<iFile>
        switch (type) {
            case 'json':
                language_list = this.parseJsonFile(file);
                break;
            case 'xml':
            case 'xmlx':
                language_list = this.parseXmlFile(file);
                break;
        }
        console.log(language_list)
        if (language_list[0])
        await this.addLanguagesCommandHandler.execute({ language_list, language })
    }

    parseXmlFile(file: Express.Multer.File): Array<iFile> {
        const workbook = read(file.buffer)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        console.log(worksheet)
        return utils.sheet_to_json(worksheet)
    }

    parseJsonFile(file: Express.Multer.File): Array<any> {
        console.log(file.buffer)
        const workbook = readFile(file.buffer as any)
        console.log(workbook)
        return []
    }
}
