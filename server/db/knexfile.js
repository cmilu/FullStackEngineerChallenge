module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: __dirname + '/revyou.db'
    },
    useNullAsDefault: true
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: __dirname + '/revyou_test.db'
    },
    useNullAsDefault: true
  }
}
