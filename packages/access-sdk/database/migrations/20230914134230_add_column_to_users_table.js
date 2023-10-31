exports.up = async function (knex) {
  return knex.schema.alterTable("access_users", function (table) {
    table.boolean("password_set").defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("access_users", function (table) {
    table.dropColumn("password_set");
  });
};
