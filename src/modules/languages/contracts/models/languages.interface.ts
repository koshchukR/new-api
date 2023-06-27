import { ApiProperty } from '@nestjs/swagger';

export class LanguagesInterface {
  @ApiProperty({ type: Number, required: false })
  _id?: number;
  @ApiProperty()
  language: string;

  @ApiProperty()
  lang_short: string;

  @ApiProperty({ type: Boolean })
  can_delete?: boolean;
}
