'use strict';

let Writeable = require('stream').Writeable;
let Buffer = require('buffer').Buffer;

module.exports = (is, cb) => {
  let converter = new Writeable();
  converter.data = [];

  converter._write = function(chunk){
    this.data.push(chunk);
  }

  converter.on('end', function(){
    let buffer = Buffer.concat(this.data);
    cb(null, buffer);
  });

  converter.on('error', function(err){
    cb(err, null);
  });
};
