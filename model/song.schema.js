'use strict';

let mongoose = require('mongoose');
let es       = require('event-stream');
let bf       = require('stream-buffers');
let mm       = require('musicmetadata');
let Buffer   = require('buffer').Buffer;
let stream   = require('stream');
let util     = require('util');

function BufferStream(source) {
  stream.Readable.call(this);

  this._source = source;
  this._offset = 0;
  this._length = source.length;

  this.on('end', this._destroy);
}

util.inherits( BufferStream, stream.Readable );

BufferStream.prototype._destroy = function() {
  this._source = null;
  this._offset = null;
  this._length = null;
};

BufferStream.prototype._read = function( size ) {
  if ( this._offset < this._length ) {
    this.push( this._source.slice( this._offset, ( this._offset + size ) ) );
    this._offset += size;
  }

  if ( this._offset >= this._length ) {
    this.push( null );
  }
};


let ts = () => {
  return es.through(function(data){
    this.emit('data',data);
  }, function(){
    this.emit('end', null);
  });
};

let getSongMetadata = (is) => {
  return new Promise((resolve, reject) => {
    mm(is, (err, meta) => {
      if (err) {
        console.log('error', err);
        return reject(err);
      } else {
        return resolve(meta);
      }
    });
  })
};

let saveSongToGfs = (gfs, is) => {
  let ws = gfs.createWriteStream({
    _id: mongoose.Types.ObjectId()
  });
  is.pipe(ws);

  return new Promise((resolve, reject) => {
    ws.on('close', (file) => {
      resolve(file);
    });

    ws.on('error', (err) => {
      console.log('error', err);
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

  SongSchema.statics.createSong = function(is, cb) {
    let p1 = ts();
    let p2 = ts();

    let inputStream = null;
    if (Buffer.isBuffer(is)) {
      inputStream = new BufferStream(is);
    } else {
      inputStream = is;
    }

    Promise.all([
      getSongMetadata(p1),
      saveSongToGfs(gfs, p2)
    ]).then((results) => {
      let meta = results[0];
      let file = results[1];
      console.log('fuck');
      cb(null, {
        meta: meta,
        file: file._id
      });
    }).catch((err) => {
      console.log(err.message);
      cb(err, null);
    });

    inputStream.pipe(p1).pipe(p2);
  };

  return mongoose.model('Song', SongSchema);
}
