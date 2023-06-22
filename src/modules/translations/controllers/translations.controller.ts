import { Controller, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TranslationsService } from "../services/translations.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('locales')
export class TranslationsController {
  constructor(private readonly service: TranslationsService) {
  }

  @Post('add/:language/:file([a-z|A-Z\\d\\-_]*.(?:xmlx|xml|json))')
  @UseInterceptors(FileInterceptor('file'))
  updateXML(@UploadedFile() file: Express.Multer.File, @Param('language')language: string,@Param('file')file_name: string ) {
    this.service.createUpdateTranslationFile(file, language, file_name);
  }

}
