'use strict';

function SongsController(playerSrv, $scope, messages) {
  $scope.songs = [];
  $scope.error = false;
  $scope.errMessage = "";

  playerSrv.getSongs().then((songs) => {
    $scope.songs = songs;
  }, () => {
    $scope.error = true;
    $scope.errorMessage = messages.loadError;
  });

  $scope.delete = (song) => {
    playerSrv.deleteSong(song._id).then((res) => {
      let index = $scope.songs.indexOf(song);
      $scope.songs.splice(index, 1);
    }, () => {
      $scope.error = true;
      $scope.errMessage = messages.deleteError;
    });
  };

}

module.exports = ['PlayerService', '$scope', 'messages', SongsController];
