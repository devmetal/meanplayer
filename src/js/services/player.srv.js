'use strict';

class PlayerService {
  constructor($http, $q) {
    this.http = http;
    this.q = q;
  }

  getSongs() {
    return this.q((resolve, reject) => {
      this.http.get('/songs/')
        .then((result) => {
          resolve(result.data);
        }, (err) => reject(err));
    });
  }
}

PlayerService.$inject = ['$http', '$q'];
