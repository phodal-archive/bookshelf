angular.module('starter.controllers', ['ionic', 'ngCordova'])

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

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('ScanBarcodeCtrl', function($scope, $cordovaBarcodeScanner, $http, $cordovaSQLite, $cordovaToast) {
    $scope.info = {};
    $scope.detail = {};
    document.addEventListener("deviceready", function () {
      $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          $scope.info = barcodeData;
          $http.get("https://api.douban.com/v2/book/isbn/" + barcodeData.text).success(function (data) {
            $scope.detail = data;

            var db = $cordovaSQLite.openDB({ name: "my.db", bgType: 1 });
            $scope.execute = function() {
              var query = "INSERT INTO bookself (title, price, author, summary, isbn) VALUES (?,?,?,?,?)";
              $cordovaSQLite.execute(db, query, [data.title, data.price, data.author, data.summary, data.isbn]).then(function(res) {
                console.log("insertId: " + res.insertId);
                $cordovaToast
                  .show("insertId: " + res.insertId, 'long', 'center')
                  .then(function(success) {
                    // success
                  }, function (error) {
                    // error
                  });

              }, function (err) {
                $cordovaToast
                  .show(err, 'long', 'center')
                  .then(function(success) {
                    // success
                  }, function (error) {
                    // error
                  });

              });
            };
          });
        }, function(error) {
          // An error occurred
        });
    }, false);
});
