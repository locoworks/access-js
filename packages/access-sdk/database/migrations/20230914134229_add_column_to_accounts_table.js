exports.up = async function (knex) {
  return knex.schema.alterTable("access_accounts", function (table) {
    table.string("type");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("access_accounts", function (table) {
    table.dropColumn("type");
  });
};
