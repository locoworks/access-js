export async function up(knex) {
  return knex.schema.createTable("access_admins", function (table) {
    table.string("id").notNullable().primary();
    table.string("tenant_id").notNullable();
    table.string("email", 255);
    table.string("password", 255);
    table.json("permissions");
    table.json("meta");
    table.datetime("created_at");
    table.datetime("updated_at");
    table.datetime("deleted_at");
  });
}

export async function down(knex) {
  return knex.schema.dropTable("access_admins");
}
