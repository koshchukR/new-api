import { ApiProperty } from '@nestjs/swagger';

export class TranslationInterface {
  @ApiProperty({ type: Number })
  _id: number;
  @ApiProperty()
  value: string;
  @ApiProperty({ type: Number })
  languages_id: number;
  @ApiProperty()
  key: string;
}
