exports.up = async function (knex) {
  return knex.schema.createTable("access_keys", function (table) {
    table.string("id").notNullable().primary();
    table.string("account_id").notNullable();
    table.string("name", 255);
    table.string("mode", 255); // live, test
    table.text("publishable_key");
    table.text("secret_key");
    table.json("scope");
    table.datetime("created_at");
    table.datetime("updated_at");
    table.datetime("deleted_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("access_keys");
};
