angular.module("Session", ["ngRoute"])
  .service("Session", function() {
      this.create = (sessId, username, rsName) => {
          this.id = sessId;
          this.username = username;
          this.rsName = rsName;
      };

      this.destroy = () => {
          this.id = null;
          this.username = null;
          this.rsName = null;
      };
  });
