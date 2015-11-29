'use strict';

let mongoose = require('mongoose');
let Grid     = require('gridfs-stream');

let db = process.env.DB;

module.exports = function(app) {
  Grid.mongo = mongoose.mongo;
  mongoose.connect(db);

  let gfs = Grid(mongoose.connection.db);

  app.set('gfs', gfs);
  app.set('SongModel', require('./song.schema')(app));
}
