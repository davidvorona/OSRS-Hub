// register myApp as an angular module, array specifies dependencies and controllers
const rsApp = angular.module("rsApp", [
    "ngRoute",
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
    "BuildCalculator",
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

    $scope.setCurrentUser = (username, rsName, pLen) => {
        $scope.currentUser = username;
        $scope.rsName = rsName;
        $scope.pLen = pLen;
    };

    $scope.autoLogin = () => {
        $http.get("/cookies")
          .then((res) => {
              if (res.data.user) {
                  Session.create(res.data.user[0].sessId, res.data.user[0].username,
                    res.data.user[0].rsName);
                  $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                  $scope.setCurrentUser(res.data.user[0].username, res.data.user[0].rsname, res.data.user[0].password);
                  return res;
              }
          }, (err) => {
              console.log("Error in ApplicationController.");
              console.log(err);
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
          controller: "AccountController"
      })

      .when("/players", {
          templateUrl: "public/players/players.html",
          controller: "PlayerController"
      })

      .when("/build", {
          templateUrl: "public/builds/build.html",
          controller: "BuildController"
      })

      .otherwise({
          redirectTo: "/"
      });
});
