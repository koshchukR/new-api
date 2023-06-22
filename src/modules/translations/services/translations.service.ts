import { Injectable } from '@nestjs/common';
import { readFile, utils, set_fs, read } from "xlsx";
import { iFile } from "../commands/add-language.command";
import { AddLanguagesCommandHandler } from "../commands/handlers/add-languages.command-handler";
import { isObject } from "@nestjs/common/utils/shared.utils";

@Injectable()
export class TranslationsService {
    constructor(private addLanguagesCommandHandler: AddLanguagesCommandHandler) {
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
        }

        if (language_list[0])
        await this.addLanguagesCommandHandler.execute({ language_list, language })
    }

    parseXmlFile(file: Express.Multer.File): Array<iFile> {
        const workbook = read(file.buffer)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        return utils.sheet_to_json(worksheet)
    }

    parseJsonFile(file: any): Array<iFile> {
        file.flat()
        console.log(file)
        return this.getKeyValue(Object.entries(file))
    }

    getKeyValue(obj) {
        return obj.map(([key, value]) => {
            if (typeof value == "object") {
                let res = this.getKeyValue(Object.entries(value))
                if (res[0] && !res[0].key) {
                    res = res[0]
                }
                return res.map(({ key: newKey, value: newValue }, index) => {
                    let someKey = key
                    someKey = [key, newKey].join('.')
                    value = newValue
                    return ({ key: someKey, value })
                })
            } else {
                return ({ key, value })
            }
        }).flat()
    }


    // const res =  Object.entries(obj).map(( [key, value])=>{
    //      if (typeof value === "object") {
    //          let res = this.getKeyValue(value)
    //          key = [key, res.key].join('.')
    //          value = res.value
    //      }
    //      return({key, value})
    //  })
    //
    //  console.log(res)
    //  return res
}

