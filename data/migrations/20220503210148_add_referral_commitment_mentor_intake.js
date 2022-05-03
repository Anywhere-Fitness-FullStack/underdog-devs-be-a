exports.up = function (knex) {
  return knex.schema.table('mentor_intake', function (table) {
    table.string('referred_by').notNullable();
    table.string('commitment').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('mentor_intake', function (table) {
    table.dropColumn('commitment');
    table.dropColumn('referred_by');
  });
};
