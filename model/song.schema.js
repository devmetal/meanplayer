'use strict';

let mongoose = require('mongoose');
let es       = require('event-stream');
let mm       = require('musicmetadata');
let Buffer   = require('buffer').Buffer;
let stream   = require('stream');
let utils    = require('../utils');
let co       = require('co');

let BufferStream = utils.BufferStream;
let ts           = utils.throughStream;

let getSongMetadata = (is) => {
  return new Promise((resolve, reject) => {
    mm(is, (err, meta) => {
      if (!err) {
        return resolve(meta);
      } else {
        return reject(err);
      }
    });
  })
};

let saveFileToGfs = (gfs, is) => {
  let ws = gfs.createWriteStream({
    _id: mongoose.Types.ObjectId()
  });

  is.pipe(ws);

  return new Promise((resolve, reject) => {
    ws.on('close', (file) => {
      resolve(file);
    });

    ws.on('error', (err) => {
      reject(err);
    })
  });
};

module.exports = function(app) {
  let gfs = app.get('gfs');

  let SongSchema = mongoose.Schema({
    meta: mongoose.Schema.Types.Mixed,
    _fsId: mongoose.Schema.Types.ObjectId
  });

  SongSchema.methods.getFile = function() {
    return gfs.createReadStream({
      _id: this._fsId
    });
  };

  /**
   * TODO: FIXME
   */
  SongSchema.statics.createSong = function(is) {
    let p1 = ts();
    let p2 = ts();
    let inputStream = null;

    if (Buffer.isBuffer(is)) {
      inputStream = new BufferStream(is);
    } else {
      inputStream = is;
    }

    let song = new this();

    co(function*(){
      let results = yield [getSongMetadata(p1), saveFileToGfs(gfs, p2)];
      let meta = results[0];
      let file = results[0];

      song.meta = meta;
      song._fsId = file._id;

      return yield song.save();
    });

    inputStream.pipe(p1).pipe(p2);
  };

  return mongoose.model('Song', SongSchema);
}
