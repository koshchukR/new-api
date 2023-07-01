import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LanguagesEntity } from './language.entity';

@Entity('translations')
export class TranslationsEntity {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => LanguagesEntity, (language) => language.translations)
  @JoinColumn({ name: 'languages_id' })
  languages: LanguagesEntity;
}
