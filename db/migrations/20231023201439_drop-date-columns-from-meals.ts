import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('mealDate')
    table.dropColumn('mealHour')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.date('mealDate').notNullable()
    table.time('mealHour').notNullable()
  })
}
