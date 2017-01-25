angular.module('FavoritesFactory', ['ngRoute'])
  .factory('FavoritesFactory', () => {
    const dataFactory = {};

    dataFactory.getFavorites = () => Object.keys(localStorage);

    dataFactory.chooseFavorite = () => {
      if (localStorage.favoritesChoice) return localStorage.favoritesChoice;
    };

    return dataFactory;
  });
