angular.module("UserService", ["ngRoute"])
  .factory("UserService", ["authVals", function(authVals) {
      const User = {};

      User.create = (sessId, username, rsName, pLen) => {
          authVals.sessId = sessId;
          authVals.currentUser = username;
          authVals.rsName = rsName;
          authVals.pLen = pLen;
      };

      User.destroy = () => {
          authVals.sessId = null;
          authVals.currentUser = null;
          authVals.rsName = null;
          authVals.pLen = null;
      };

      return User;
  }]);
