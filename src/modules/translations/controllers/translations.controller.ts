import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors, StreamableFile } from "@nestjs/common";
import { TranslationsService } from "../services/translations.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { response, Response } from "express";
import {createReadStream} from 'fs'

@Controller('locales')
export class TranslationsController {
    constructor(private readonly service: TranslationsService) {
    }

    @Get('get/:language/:file([a-z|A-Z\\d\\-_]*.(?:xmlx|xml|json))')
    async  download(@Param('language') language: string,
             @Param('file') file_name: string,
             @Res({ passthrough: true }) response: Response
    ) {
        const errorHandler = (e) => {
            console.error(e);
            // response.end();
        };

        const stream = await this.service.downloadFile(language,file_name, errorHandler)
        response.set({
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="Languages_${language}.xlsx"`
        })
        return new StreamableFile(stream);

    }

    @Post('add/:language/:file([a-z|A-Z\\d\\-_]*.(?:xmlx|xml|json))')
    @UseInterceptors(FileInterceptor('file'))
    update(@UploadedFile() file: Express.Multer.File,
           @Param('language') language: string,
           @Param('file') file_name: string) {
        this.service.createUpdateTranslationFile(file, language, file_name);
    }


}
