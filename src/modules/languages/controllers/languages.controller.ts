import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LanguagesInterface } from '../contracts/models/languages.interface';
import { LanguagesService } from '../services/languages.service';
import { LanguageFilter } from '../contracts/filter/language.filter';
import { ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('languages')
export class LanguagesController {
  constructor(private service: LanguagesService) {}

  @Get()
  @ApiOkResponse({ type: [LanguagesInterface] })
  list(@Query() filter: LanguageFilter): Promise<Array<LanguagesInterface>> {
    return this.service.getLanguageList(filter);
  }

  @Get(':id')
  @ApiOkResponse({ type: LanguagesInterface })
  getOne(@Param('id') id: number): Promise<LanguagesInterface> {
    return this.service.getLanguageById(id);
  }

  @Post()
  @ApiNoContentResponse()
  add(@Body() body: LanguagesInterface): Promise<void> {
    return this.service.addLanguage(body);
  }

  @Put(':id')
  @ApiNoContentResponse()
  update(
    @Param('id') id: number,
    @Body() body: LanguagesInterface,
  ): Promise<void> {
    return this.service.updateLanguage({ _id: id, ...body });
  }

  @Delete(':id')
  @ApiNoContentResponse()
  delete(@Param('id') id: number): Promise<void> {
    return this.service.deleteLanguage(id);
  }
}
