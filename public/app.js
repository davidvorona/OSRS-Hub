// register myApp as an angular module, array specifies dependencies and controllers
const rsApp = angular.module("rsApp", [
    "ngRoute",
    "FavoritesFactory",
    "FavoritesController",
    "ItemFactory",
    "ItemController",
    "PlayerFactory",
    "PlayerController",
    "smart-table"
]);

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

      .when("/players", {
          templateUrl: "public/players/players.html",
          controller: "PlayerController"
      })

      .otherwise({
          redirectTo: "/"
      });
});
