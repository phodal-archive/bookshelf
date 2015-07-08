angular.module('starter.controllers', ['ionic', 'ngCordova', 'starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  $scope.loginData = {};

  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.doLogin = function() {
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, DBA) {
		$scope.playlists = [];
		var query = "SELECT * FROM bookself";
		DBA.query(query)
			.then(function (result) {
				$scope.playlists = result
			});
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('ScanBarcodeCtrl', function($scope, $cordovaBarcodeScanner, $http, $cordovaSQLite) {
    $scope.info = {};
    $scope.detail = {};
    $scope.error = {};

    function saveToDatabase(data, barcodeData) {
      $scope.execute = function () {
        var query = "INSERT INTO bookself (id, title, price, author, summary, isbn) VALUES (?, ?,?,?,?,?)";
        $cordovaSQLite.execute(db, query, ["1", "title", "price", "author", "summary", "text"]).then(function (res) {
          alert(res);
          $scope.error = res;
        }, function (err) {
          alert(err);
          $scope.error = err;
        });
      };
    }

    document.addEventListener("deviceready", function () {
      $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          $scope.info = barcodeData.text;
          $http.get("https://api.douban.com/v2/book/isbn/" + barcodeData.text).success(function (data) {
            $scope.detail = data;
            saveToDatabase(data, barcodeData);
          });
        }, function(error) {
		      alert(error);
        });
    }, false);
});
