export interface AddLanguageCommand {
  language: string,
  language_list?:Array<iFile>
}

export interface iFile {
  key: string,
  value:string
}