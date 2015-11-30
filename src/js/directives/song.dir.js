'use strict';

module.exports = function(){
  return {
    scope: {
      song: '=',
      delete: '&onDelete'
    },
    restrict: 'EA',
    templateUrl: 'song.html'
  }
};
