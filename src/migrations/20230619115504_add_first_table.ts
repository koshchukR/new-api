import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('languages', (tableBuilder) => {
    tableBuilder.increments('_id', { primaryKey: true });
    tableBuilder.string('language').notNullable().unique();
    tableBuilder
      .string('lang_short', 5)
      .checkRegex('[a-z][a-z]_[A-Z][A-Z]')
      .notNullable()
      .unique();
    tableBuilder.boolean('can_delete')
      .defaultTo(true);
  });


  await knex.schema.createTable('translations', (tableBuilder) => {
    tableBuilder.increments('_id', { primaryKey: true });
    tableBuilder.string('key')
    tableBuilder.string('value').notNullable();
    tableBuilder.integer('languages_id').unsigned();
    tableBuilder.foreign('languages_id').references('languages._id');

  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropViewIfExists('languages');
  await knex.schema.dropViewIfExists('translations');
}
