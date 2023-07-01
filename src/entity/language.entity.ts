import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TranslationsEntity } from './translation.entity';

@Entity('languages')
export class LanguagesEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  language: string;

  @Column()
  lang_short: string;

  @Column({ default: true })
  can_delete: boolean;

  @OneToMany(
    () => TranslationsEntity,
    (translations) => translations.languages,
  )
  translations: TranslationsEntity[];
}
