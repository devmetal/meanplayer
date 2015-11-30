'use strict';

let mongoose = require('mongoose');
let Grid     = require('gridfs-stream');

Grid.mongo = mongoose.mongo;

module.exports = function(app) {
  let db = process.env.DB;

  mongoose.connect(db);

  let gfs = Grid(mongoose.connection.db);

  app.set('gfs', gfs);
  app.set('SongModel', require('./song.schema')(app));
}
