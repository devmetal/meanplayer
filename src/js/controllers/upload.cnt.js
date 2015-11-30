'use strict';

function UploadController(Upload, $scope, messages) {

  $scope.process = 0;
  $scope.uploading = false;
  $scope.success = false;
  $scope.error = false;
  $scope.errMessage = "";
  $scope.files = [];
  $scope.uploadedFiles = [];

  $scope.upload = (files) => {
    if (!files) {
      return;
    }

    let validFiles = [];
    for (let file of files) {
      if (!/audio\/.*/.test(file.type)) {
        file.error = true;
      } else {
        validFiles.push(file);
      }
    }

    $scope.files = files;
    $scope.uploading = true;
    $scope.startUpload(validFiles);
  };

  $scope.startUpload = (files) => {
    Upload.upload({
      url: '/songs/',
      arrayKey:'',
      data: {files: files},
    }).then(
      resp => {
        let data = resp.data;
        $scope.files = [];
        $scope.uploading = false;
        $scope.success = true;
        $scope.uploadedFiles = data.files;
      },
      err => {
        $scope.files = [];
        $scope.uploading = false;
        $scope.success = false;
        $scope.error = true;
        $scope.errMessage = messages.uploadError;
      },
      evt => {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $scope.process = progressPercentage;
      }
    );
  };
};

module.exports = ['Upload', '$scope', 'messages', UploadController];
