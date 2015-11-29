'use strict';

function PlayerService($http, $q) {
  this.http = $http;
  this.q = $q;
}

PlayerService.prototype.getSongs = function() {
  return this.q((resolve, reject) => {
    this.http.get('/songs/')
      .then((result) => {
        resolve(result.data);
      }, (err) => reject(err));
  });
}

PlayerService.$inject = ['$http', '$q'];

module.exports = PlayerService;
