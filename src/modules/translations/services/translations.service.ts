import { Injectable } from '@nestjs/common';
import * as XLSX from "xlsx";
import { read, utils, write } from "xlsx";
import { iFile } from "../commands/add-language.command";
import { AddTranslationsCommandHandler } from "../commands/handlers/add-translations.command-handler";
import { GetTranslationsCommandHandler } from "../commands/handlers/get-translations.command-handler";

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
                language_list = this.parseJsonFile(JSON.parse(file.buffer.toString()));
                break;
            case 'xml':
            case 'xmlx':
                language_list = this.parseXmlFile(file);
                break;
            case 'yml':
                //TODO YALM FILE
                break;
            default:
                throw Error('Format incorrect')
        }

        if (language_list[0])
            await this.addLanguagesCommandHandler.execute({ language_list, language })
    }


    async downloadFile(language, file_name, errorCallback: (e) => void) {
        const type = file_name.split('.').slice(-1)[0]

        const translations = await this.getTranslationsCommandHandler.execute({ language })

        let ws = XLSX.utils.json_to_sheet(translations);
        let wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, `Languages_${language}.xlsx`);
        return XLSX.write(wb, { bookType: "xlsx", type: "buffer" })


    }

    private parseXmlFile(file: Express.Multer.File): Array<iFile> {
        const workbook = read(file.buffer)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        return utils.sheet_to_json(worksheet)
    }

    private parseJsonFile(file: any): Array<iFile> {
        return this.getKeyValue(Object.entries(file))

    }

    private writeFileXmls(data) {

        return write(data, { type: "buffer", bookType: "xlsx" })
    }

    private getKeyValue(obj) {
        return obj.map(([key, value]) => {
            if (typeof value == "object") {
                let res = this.getKeyValue(Object.entries(value))
                if (res[0] && !res[0].key) {
                    res = res[0]
                }
                return res.map(({ key: newKey, value: newValue }, index) => {
                    let someKey;
                    someKey = [key, newKey].join('.')
                    value = newValue
                    return ({ key: someKey, value })
                })
            } else {
                return ({ key, value })
            }
        }).flat()
    }
}

