angular.module('starter.controllers', ['ionic', 'ngCordova', 'starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
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
      var db = $cordovaSQLite.openDB({name: "my.db"});
      $scope.execute = function () {
        var query = "INSERT INTO bookself (title, price, author, summary, isbn) VALUES (?,?,?,?,?)";
        $cordovaSQLite.execute(db, query, [data.title, data.price, data.author, data.summary, barcodeData.text]).then(function (res) {
          $scope.error = res.insertId;
        }, function (err) {
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
            $scope.error = [data.title, data.price, data.author, data.summary, barcodeData.text];

            saveToDatabase(data, barcodeData);
          });
        }, function(error) {
		      alert(error);
        });
    }, false);
});
