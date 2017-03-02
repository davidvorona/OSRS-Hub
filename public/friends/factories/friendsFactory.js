angular.module("FriendsFactory", ["ngRoute"])
  .factory("FriendsFactory", ($http, BuildCalculator) => {
      const handleError = (errorCode, error) => {
          if (errorCode === 500) return { err: "There was an error." };
          return { err: error };
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
            , err =>
                handleError(err.status)
            );

      return friendsList;
  });
