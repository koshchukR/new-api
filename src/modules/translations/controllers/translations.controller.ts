import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TranslationsService } from '../services/translations.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiProduces,
} from '@nestjs/swagger';
import { TranslationInterface } from '../contracts/models/translation.interface';

@Controller('locales')
export class TranslationsController {
  constructor(private readonly service: TranslationsService) {}

  @Get(':id')
  @ApiOkResponse({ isArray: true, type: TranslationInterface })
  get(@Param('id') id: number) {
    return this.service.getTranslateById(id);
  }

  @Get(':language/:file([a-z|A-Z\\d\\-_]*.(?:xlsx|xls|json|yaml))')
  @ApiProduces('arraybuffer')
  @ApiOkResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
  })
  async download(
    @Param('language') language: string,
    @Param('file') file_name: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const stream = await this.service.downloadFile(language, file_name);
    let contentType = 'application/octet-stream';
    if (file_name.endsWith('.xlsx') || file_name.endsWith('.xls')) {
      contentType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (file_name.endsWith('.json')) {
      contentType = 'application/json';
    } else if (file_name.endsWith('.yaml')) {
      contentType = 'application/x-yaml';
    }
    response.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${file_name}"`,
    });
    return new StreamableFile(stream);
  }

  @Post('add/:language/:file([a-z|A-Z\\d\\-_]*.(?:xlsx|xls|json|yaml))')
  @ApiNoContentResponse()
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('language') language: string,
    @Param('file') file_name: string,
  ): Promise<void> {
    await this.service.createUpdateTranslationFile(file, language, file_name);
  }
}
