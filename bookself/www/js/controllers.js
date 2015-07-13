angular.module('starter.controllers', ['ionic', 'ngCordova', 'starter.services'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $http, DBA) {
  $scope.loginData = {};

  $ionicModal.fromTemplateUrl('templates/upload.html', {
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
    var query = "SELECT image,isbn,title FROM bookshelf";
    DBA.query(query)
      .then(function (result) {
        var data = DBA.getAll(result);
        $http.put('http://mqtt.phodal.com/topics/bookshelf/' + $scope.loginData.username, data)
          .then(function (response, status) {
            $scope.closeLogin();
          }, function (err) {
            alert(JSON.stringify(err));
          });
      });
  };
})

.controller('BookListsCtrl', function($scope, DBA, bookshelfDB) {
		$scope.booklists = [];
    $scope.getLists = function() {
      var query = "SELECT * FROM bookshelf";
      DBA.query(query)
        .then(function (result) {
          $scope.booklists = DBA.getAll(result);
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$apply()
        });
    };
    $scope.delete = function (id) {
      bookshelfDB.remove({id: id});
      $scope.getLists();
    };
    $scope.getLists();
})

.controller('BookDetailCtrl', function($scope, $stateParams, bookshelfDB) {
    bookshelfDB.get($stateParams.id).then(function(result){
      $scope.booklist = result;
    });
})

.controller('BrowseCtrl', function($scope, DBA) {
    $scope.booklists = [];
    $scope.getLists = function() {
      var query = "SELECT * FROM bookshelf";
      DBA.query(query)
        .then(function (result) {
          $scope.booklists = DBA.getAll(result);
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$apply()
        });
    };
    $scope.getLists();
  })

.controller('ScanBarcodeCtrl', function($scope, $cordovaBarcodeScanner, $http, bookshelfDB) {
    $scope.info = {};
    $scope.detail = {};
    $scope.error = {};

    function saveToDatabase(data, barcodeData) {
      bookshelfDB.add({
        title: data.title,
        image: data.image,
        publisher: data.publisher,
        author: data.author,
        summary: data.summary,
        isbn: barcodeData.text
      });
    }

    $scope.scan = function () {
      $cordovaBarcodeScanner
        .scan()
        .then(function (barcodeData) {
          $scope.info = barcodeData.text;
          $http.get("https://api.douban.com/v2/book/isbn/" + barcodeData.text).success(function (data) {
            $scope.detail = data;
            saveToDatabase(data, barcodeData);
          });
        }, function (error) {
          alert(error);
        });
    }
});
