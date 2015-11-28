'use strict';

let mongoose = require('mongoose');
let es       = require('event-stream');
let mm       = require('musicmetadata');

let ts = () => {
  return es.trough(function(data){
    this.emit('data',data);
  }, function(){
    this.emit('end');
  });
};

let getSongMetadata = (is) => {
  return new Promise((resolve, reject) => {
    mm(is, (err, meta) => {
      if (err) {
        return reject(err);
      } else {
        return resolve(meta);
      }
    });
  })
};

let saveSongToGfs = (is) => {
  let ws = gfs.createWriteStream();
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

module.exports = function(gfs) {

  let SongSchema = mongoose.Schema({
    meta: mongoose.Schema.Types.Mixed,
    _fsId: mongoose.Schema.Types.ObjectId
  });

  SongSchema.methods.getFile = () => {
    return gfs.createReadStream({
      _id: this._fsId
    });
  };

  SongSchema.statics.createSong = (is, cb) => {
    let p1 = ts();
    let p2 = ts();

    is.pipe(p1).pipe(p2);

    Promise.all([
      getSongMetadata(p1),
      saveSongToGfs(p2)
    ]).then((meta, file) => {
      let newSong = new this();
      newSong.meta = meta;
      newSong.fsId = file._id;
      newSong.save((err) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, newSong);
        }
      })
    }).catch((err) => {
      cb(err, null);
    })
  };

  return mongoose.model('Song', SongSchema);
}
