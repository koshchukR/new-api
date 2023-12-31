import { iFile } from '../commands/add-language.command';
import * as XLSX from 'xlsx';
import { read, utils } from 'xlsx';
import { createReadStream, writeFileSync } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { PassThrough, Readable } from 'stream';
import * as yaml from 'js-yaml';

export class FileFormationHelper {
  static parseObj = (key, value, arr) => {
    if (typeof value == 'object') {
      const [newKey, newValue] = Object.entries(value)[0];
      arr[key] = {};
      arr[key] = this.parseObj(newKey, newValue, arr[key]);
      return arr;
    }
    return arr;
  };

  static parseXmlFile(file: Express.Multer.File): Array<iFile> {
    const workbook = read(file.buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    return utils.sheet_to_json(worksheet);
  }

  static writeFileYaml(data) {
    const result = this.setKeyValue(data)
    const yamlRes = yaml.dump(result);
    const stream = new Readable();
    stream.push(yamlRes);
    stream.push(null);
    return stream
  }

  static parseJsonFile(file: any): Array<iFile> {
    return this.getKeyValue(Object.entries(file));
  }

  static writeFileXlsx(data, language) {
    let ws = XLSX.utils.json_to_sheet(data);

    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Languages_${language}.xlsx`);
    const res = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    const stream = new PassThrough();
    stream.end(res);

    return stream;
  }

  static writeFileJson(data) {
    const jsonStr = JSON.stringify(this.setKeyValue(data), null, 2);

    // Create a temporary file with a shorter name
    const tempFileName = 'temp.json';
    const tempFilePath = path.join(os.tmpdir(), tempFileName);
    writeFileSync(tempFilePath, jsonStr);

    // Create a read stream from the temporary file
    const stream = createReadStream(tempFilePath);

    return createReadStream(tempFilePath);
  }

  private static setKeyValue(data): {[key:string]: any} {
    const result = {};

    for (const item of data) {
      const keys = item.key.split('.');
      let currentObj = result;

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
    return result;
  }

  private static getKeyValue(obj) {
    return obj
      .map(([key, value]) => {
        if (typeof value == 'object') {
          let res = this.getKeyValue(Object.entries(value));
          if (res[0] && !res[0].key) {
            res = res[0];
          }
          return res.map(({ key: newKey, value: newValue }, index) => {
            let someKey;
            someKey = [key, newKey].join('.');
            value = newValue;
            return { key: someKey, value };
          });
        } else {
          return { key, value };
        }
      })
      .flat();
  }
}
