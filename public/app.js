// register myApp as an angular module, array specifies dependencies and controllers
const rsApp = angular.module("rsApp", [
    "ngRoute",
    "ngCookies",
    "Session",
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
    "BuildController",
    "smart-table"
]);

rsApp.constant("AUTH_EVENTS", {
    loginSuccess: "login-success",
    loginFailure: "login-failure",
    logoutSuccess: "logout-success",
    sessionTimeout: "session-timeout",
    notAuthenticated: "not-authenticated"
});

rsApp.controller("ApplicationController", function ApplicationController(
  $scope, $rootScope, $http, AUTH_EVENTS, AccountFactory, Session) {
    $scope.currentUser = null;
    $scope.isAuthorized = AccountFactory.isAuthorized;

    $scope.setCurrentUser = (username, rsName) => {
        $scope.currentUser = username;
        $scope.rsName = rsName;
    };

    $scope.autoLogin = () => {
        $http.get("/cookies")
          .then((res) => {
              if (res.data.user) {
                  Session.create(res.data.user[0].sessId, res.data.user[0].username,
                    res.data.user[0].rsName);
                  $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                  $scope.setCurrentUser(res.data.user[0].username, res.data.user[0].rsname);
                  return res;
              }
          }, (err) => {
              console.log(`Factory error: ${err}`);
          });
    };
});

rsApp.config(($routeProvider, $locationProvider) => {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider
      .when("/", {
          templateUrl: "public/items/items.html",
          controller: "ItemController"
      })

      .when("/account", {
          templateUrl: "public/account/account.html",
          controller: "AccountController" // this might need to change
      })

      .when("/players", {
          templateUrl: "public/players/players.html",
          controller: "PlayerController"
      })

      .when("/build", {
          templateUrl: "public/build/build.html",
          controller: "BuildController"
      })

      .otherwise({
          redirectTo: "/"
      });
});
