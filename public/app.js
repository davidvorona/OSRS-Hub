// register myApp as an angular module, array specifies dependencies and controllers
const rsApp = angular.module("rsApp", [
    "ngRoute",
    "FormatService",
    "UserService",
    "AccountFactory",
    "LoginController",
    "CreateController",
    "AccountController",
    "FavoritesFactory",
    "FavoritesController",
    "ItemFactory",
    "ItemController",
    "PlayerFactory",
    "PlayerController",
    "BuildFactory",
    "BuildCalculator",
    "BuildsListController",
    "BuildController",
    "FriendsFactory",
    "FriendsController",
    "smart-table"
]);

// TODO: overall recommendation tool that
// takes skills / desired skills and returns quests

// account events
rsApp.constant("AUTH_EVENTS", {
    loginSuccess: "login-success",
    loginFailure: "login-failure",
    logoutSuccess: "logout-success",
    sessionTimeout: "session-timeout",
    notAuthenticated: "not-authenticated"
});

// login information
rsApp.value("authVals", {
    sessId: null,
    currentUser: null,
    rsName: null,
    pLen: null
});

// runs on load, after config
rsApp.run(["$rootScope", "AccountFactory", function($rootScope, AccountFactory) {
    $rootScope.isLoggedIn = false;
    AccountFactory.autoLogin();
}]);

// routing
rsApp.config(["$routeProvider", "$locationProvider", ($routeProvider, $locationProvider) => {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider
      .when("/", {
          templateUrl: "static/items/items.html",
          controller: "ItemController"
      })

      .when("/account", {
          templateUrl: "static/account/account.html",
          controller: "AccountController"
      })

      .when("/players", {
          templateUrl: "static/players/players.html",
          controller: "PlayerController"
      })

      .when("/players/:player", {
          templateUrl: "static/players/players.html",
          controller: "PlayerController"
      })

      .when("/build", {
          templateUrl: "static/builds/build.html",
          controller: "BuildController"
      })

      .when("/build/:build", {
          templateUrl: "static/builds/build.html",
          controller: "BuildController"
      })

      .when("/friends", {
          templateUrl: "static/friends/friends.html",
          controller: "FriendsController"
      })

      .when("/mybuilds", {
          templateUrl: "static/builds/builds.html",
          controller: "BuildsListController"
      })

      .otherwise({
          redirectTo: "/"
      });
}]);
