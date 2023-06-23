import { Controller, Get, Param, Post, Res, StreamableFile, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TranslationsService } from "../services/translations.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

@Controller('locales')
export class TranslationsController {
    constructor(private readonly service: TranslationsService) {
    }

    @Get(':language/:file([a-z|A-Z\\d\\-_]*.(?:xlsx|xls|json))')
    async download(@Param('language') language: string,
                   @Param('file') file_name: string,
                   @Res({ passthrough: true }) response: Response
    ): Promise<StreamableFile | void> {
        const stream = await this.service.downloadFile(language, file_name)
        response.set({
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="Languages_${language}.xlsx"`
        })
        return new StreamableFile(stream);

    }

    @Post('add/:language/:file([a-z|A-Z\\d\\-_]*.(?:xmlx|xml|json))')
    @UseInterceptors(FileInterceptor('file'))
    async update(@UploadedFile() file: Express.Multer.File,
                 @Param('language') language: string,
                 @Param('file') file_name: string): Promise<void> {
        await this.service.createUpdateTranslationFile(file, language, file_name);
    }


}
