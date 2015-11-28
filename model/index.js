'use strict';

let mongoose = require('mongoose');
let Grid     = require('gridfs-stream');

module.exports = function(app) {
  Grid.mongo = mongoose.mongo;
  let db = process.env.DB;
  let conn = mongoose.createConnection(db);

  conn.once('open', () => {
    let gfs = Grid(conn.db);
    app.set('gfs', gfs);

    require('./song.schema').init(app);
  });
}
