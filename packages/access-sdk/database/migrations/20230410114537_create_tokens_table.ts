import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
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
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable("access_tokens");
}
