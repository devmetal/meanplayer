'use strict';

function UploadController(Upload, $scope) {

  $scope.process = 0;
  $scope.uploading = false;
  $scope.finished = false;
  $scope.error = false;
  $scope.errorMsg = "";
  $scope.files = [];
  $scope.uploadedFiles = [];

  $scope.$watch('uploading', (newValue, oldValue) => {
    if (newValue === true && oldValue === false) {
      $scope.finished = false;
    } else if (newValue === false && oldValue === true) {
      $scope.finished = true;
    }
  });

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
        $scope.uploading = false;
        let data = resp.data;
        if (data.error) {
          
        }
        $scope.uploadedFiles = resp.data.files;
      },
      err => {
        $scope.uploading = false;
        $scope.error = true;
        $scope.errorMsg = "System error";
      },
      evt => {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $scope.process = progressPercentage;
      }
    );
  };
};

module.exports = ['Upload', '$scope', UploadController];
