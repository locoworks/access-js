exports.up = async function (knex) {
  return knex.schema.createTable("access_tenants", function (table) {
    table.string("id").notNullable().primary();
    table.string("name", 255);
    table.boolean("default").defaultTo(false);
    table.datetime("created_at");
    table.datetime("updated_at");
    table.datetime("deleted_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("access_tenants");
};
