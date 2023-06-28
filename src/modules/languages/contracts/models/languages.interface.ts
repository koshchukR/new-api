import { ApiProperty } from '@nestjs/swagger';

export class LanguagesInterface {
  @ApiProperty({ type: Number, required: false })
  _id?: number;
  @ApiProperty()
  language: string;

  @ApiProperty()
  lang_short: string;

  @ApiProperty({ type: Boolean, required: false })
  can_delete?: boolean;

  @ApiProperty({ type: Number, required: false  })
  total?: number;

  @ApiProperty({ type: Number, required: false  })
  items?: number;
}
