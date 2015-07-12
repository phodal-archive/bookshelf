var db = null;

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    if(window.cordova) {
      //$cordovaSQLite.deleteDB("my.db");
      db = $cordovaSQLite.openDB("my.db");
    } else {
      db = window.openDatabase("my.db", "1.0", "bookshelf", -1);
    }
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS bookshelf (id integer primary key, title text, image text, publisher text, author text, isbn text, summary text)");
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.scan', {
    url: "/scan",
    views: {
      'menuContent': {
        templateUrl: "templates/scan.html",
        controller: 'ScanBarcodeCtrl'
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html",
        controller: 'BrowseCtrl'
      }
    }
  })
    .state('app.booklists', {
      url: "/booklists",
      views: {
        'menuContent': {
          templateUrl: "templates/booklists.html",
          controller: 'BookListsCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/booklists/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/booklist.html",
        controller: 'BookDetailCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/booklists');
});
