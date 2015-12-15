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

  SongSchema.statics.createSong = function(is, callback) {
    let p1 = ts(),
        p2 = ts(),
        inputStream = (Buffer.isBuffer(is)) ? BufferStream(is) : is,
        song = new this();

    Promise.all([
      getSongMetadata(p1),
      saveFileToGfs(gfs, p2)
    ]).then((results) => {
      let meta = results[0];
      let file = results[1];

      song.meta = meta;
      song._fsId = file._id;

      return song.save();
    }).then(() => {
      callback(null, song);
    }).catch((err) => {
      callback(err, null);
    });

    inputStream.pipe(p1).pipe(p2);
  };

  return mongoose.model('Song', SongSchema);
}
