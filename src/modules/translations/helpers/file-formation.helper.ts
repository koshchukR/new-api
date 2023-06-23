import { iFile } from "../commands/add-language.command";
import { read, utils, write } from "xlsx";
import * as XLSX from "xlsx";
import { createReadStream, writeFileSync } from "fs";
import { map, throttle } from "rxjs";
import * as os from "os";
import * as path from "path";

export class FileFormationHelper {

    static parseObj = (key, value, arr) => {
        if (typeof value == "object") {
            const [newKey, newValue] = Object.entries(value)[0]
            arr[key] = {}
             arr[key]= this.parseObj(newKey, newValue, arr[key])
            return arr
        }
        // arr[key]= value
        return arr
    }

    static parseXmlFile(file: Express.Multer.File): Array<iFile> {
        const workbook = read(file.buffer)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        return utils.sheet_to_json(worksheet)
    }

    static parseJsonFile(file: any): Array<iFile> {
        return this.getKeyValue(Object.entries(file))

    }

    static writeFileXmls(data, language) {
        let ws = XLSX.utils.json_to_sheet(data);
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Languages_${language}.xlsx`);
        return createReadStream(XLSX.write(wb, { bookType: "xlsx", type: "buffer" }))
    }

    static writeFileJson(data) {
      return this.setKeyValue(data)
    }

    private static setKeyValue(data) {
        let currentObj = {};

        for (const item of data) {
            const keys = item.key.split('.');

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (i === keys.length - 1) {
                    currentObj[key] = item.value;
                } else {
                    if (!currentObj.hasOwnProperty(key)) {
                        currentObj[key] = {};
                    }
                    currentObj = currentObj[key];
                }
            }
        }
        const jsonStr = JSON.stringify(currentObj, null, 2);

        // Create a temporary file with a shorter name
        const tempFileName = 'temp.json';
        const tempFilePath = path.join(os.tmpdir(), tempFileName);
        writeFileSync(tempFilePath, jsonStr);

        // Create a read stream from the temporary file
        const stream = createReadStream(tempFilePath);

        return stream;
    }

    private static getKeyValue(obj) {
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