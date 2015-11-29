'use strict';

function SongsController(Upload, $scope) {

  $scope.checkedFiles = [];

  $scope.upload = (files) => {
    if (!files) {
      return;
    }

    let validFiles = [];
    for (let file of files) {
      if (!/audio\/.*/.test(file.type)) {
        file.error = 'Hibás kiterjesztés';
      } else {
        validFiles.push(file);
      }
    }

    $scope.files = files;
    $scope.startUpload(validFiles);
  };

  $scope.startUpload = (files) => {
    Upload.upload({
      url: '/songs/',
      arrayKey:'',
      data: {files: files},
    }).then(
      resp => console.log(resp),
      err => console.log(err),
      evt => {
        console.log(evt);
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '%');
        $scope.process = progressPercentage;
      }
    );
  };
}

module.exports = ['Upload', '$scope', SongsController];
