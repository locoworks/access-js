exports.up = async function (knex) {
  return knex.schema.createTable("access_attributes", function (table) {
    table.string("id").notNullable().primary();
    table.string("user_id").notNullable();
    table.string("tenant_id").notNullable();
    table.string("type", 255);
    table.string("value", 255);
    table.datetime("verified_at");
    table.datetime("created_at");
    table.datetime("updated_at");
    table.datetime("deleted_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("access_attributes");
};
