import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.insert({language: 'English', lang_short: 'en_EN', can_delete: false}).into('languages')
}


export async function down(knex: Knex): Promise<void> {
}

