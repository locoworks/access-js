exports.up = async function (knex) {
  return knex.schema.createTable("access_accounts", function (table) {
    table.string("id").notNullable().primary();
    table.string("creator_user_id").notNullable();
    table.string("tenant_id").notNullable();
    table.string("name", 255);
    table.json("meta");
    table.datetime("created_at");
    table.datetime("updated_at");
    table.datetime("deleted_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("access_accounts");
};
