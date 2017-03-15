angular.module("FriendsFactory", ["ngRoute"])
  .factory("FriendsFactory", [
      "$http",
      "BuildCalculator",
  function($http, BuildCalculator) { // eslint-disable-line indent
      const handleError = (error) => {
          console.log(error);
          if (error.data[0].code) {
              return { err: "Unhandled pgErr." };
          }
          if (error.status === 500) return { err: "500: There was a problem with our server. Please try again." };
          return { err: "There was an error. Please try again." };
      };

      const addCombatObj = (data) => {
          data.forEach((el) => {
              const combatObj = {};
              combatObj.attack = el.Attack;
              combatObj.defence = el.Defence;
              combatObj.strength = el.Strength;
              combatObj.hitpoints = el.Hitpoints;
              combatObj.ranged = el.Ranged;
              combatObj.magic = el.Magic;
              combatObj.prayer = el.Prayer;
              el.combatLvl = BuildCalculator.osCombatLevel(combatObj);
              el.username = el.username.join(" ");
          });
          return data;
      };

      const friendsList = {};

      friendsList.getFriends = username =>
          $http.get(`/friends/${username}`)
            .then(res =>
                addCombatObj(res.data)
            , err => handleError(err));

      return friendsList;
  }]);
