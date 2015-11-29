'use strict';

function SongsController(playerSrv, $scope) {
  $scope.songs = [];

  playerSrv.getSongs().then((songs) => {
    console.log(songs);
    $scope.songs = songs;
  });

  $scope.delete = (song) => {
    console.log("delete");
    console.log(song);
    playerSrv.deleteSong(song._id).then((res) => {
      console.log('response');
      console.log(res);
      let deleted = res.deleted;
      let index = $scope.songs.indexOf(song);
      $scope.songs.splice(index, 1);
    })
  };

}

module.exports = ['PlayerService', '$scope', SongsController];
