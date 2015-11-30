'use strict';

let es = require('event-stream');

module.exports = () => {
  return es.through(function(data){
    this.emit('data',data);
  }, function(){
    this.emit('end', null);
  });
};
