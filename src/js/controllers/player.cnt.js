'use strict';

function PlayerController(playerSrv, $scope) {
  playerSrv.getSongs().then((songs) => {
    console.log(songs);
    $scope.songs = songs;
  });
}

module.exports = ['PlayerService', '$scope', PlayerController];
