import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { LanguagesInterface } from '../contracts/models/languages.interface';
import { LanguagesService } from '../services/languages.service';
import { LanguageFilter } from '../contracts/filter/language.filter';

@Controller('languages')
export class LanguagesController {
  constructor(private service: LanguagesService) {}

  @Get()
  list(@Query() filter: LanguageFilter): Promise<Array<LanguagesInterface>> {
    return this.service.getLanguageList(filter);
  }

  @Get(':id')
  getOne(@Param('id') id: number): Promise<LanguagesInterface> {
    return this.service.getLanguageById(id);
  }

  @Post()
  add(@Body() body: LanguagesInterface): Promise<void> {
    return this.service.addLanguage(body);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() body: LanguagesInterface,
  ): Promise<void> {
    return this.service.updateLanguage({ _id: id, ...body });
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.service.deleteLanguage(id);
  }
}
