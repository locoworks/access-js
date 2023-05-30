exports.up = async function (knex) {
  return knex.schema.createTable("access_verifications", function (table) {
    table.string("id").notNullable().primary();
    table.string("user_id").notNullable();
    table.string("tenant_id").notNullable();
    table.string("token", 255);
    table.string("attribute_type", 255);
    table.string("attribute_value", 255);
    table.string("purpose", 255);
    table.datetime("expires_at");
    table.datetime("created_at");
    table.datetime("updated_at");
    table.datetime("deleted_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("access_verifications");
};
