exports.up = async function (knex) {
  return knex.schema.createTable("access_tokens", function (table) {
    table.string("id").notNullable().primary();
    table.string("tenant_id").notNullable();

    table.string("sub", 255);
    table.string("issuer", 255);
    table.string("title", 255);

    table.json("permissions");
    table.json("other_info");

    table.datetime("created_at");
    table.datetime("updated_at");
    table.datetime("deleted_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("access_tokens");
};
