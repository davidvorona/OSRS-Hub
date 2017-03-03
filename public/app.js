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
    "BuildController",
    "FriendsFactory",
    "FriendsController",
    "smart-table"
]);

rsApp.constant("AUTH_EVENTS", {
    loginSuccess: "login-success",
    loginFailure: "login-failure",
    logoutSuccess: "logout-success",
    sessionTimeout: "session-timeout",
    notAuthenticated: "not-authenticated"
});

rsApp.value("authVals", {
    sessId: null,
    currentUser: null,
    rsName: null,
    pLen: null
});

rsApp.run(["$rootScope", "$location", "authVals", "AccountFactory",
    function($rootScope, $location, authVals, AccountFactory) {
        $rootScope.isLoggedIn = false;
        AccountFactory.autoLogin();
    }]);

rsApp.config(($routeProvider, $locationProvider) => {
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

      .when("/friends", {
          templateUrl: "static/friends/friends.html",
          controller: "FriendsController"
      })

      .otherwise({
          redirectTo: "/"
      });
});
