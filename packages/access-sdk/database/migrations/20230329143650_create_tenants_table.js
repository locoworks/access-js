export async function up(knex) {
  return knex.schema.createTable("access_tenants", function (table) {
    table.string("id").notNullable().primary();
    table.string("name", 255);
    table.boolean("default").defaultTo(false);
    table.datetime("created_at");
    table.datetime("updated_at");
    table.datetime("deleted_at");
  });
}

export async function down(knex) {
  return knex.schema.dropTable("access_tenants");
}
