angular.module("Session", ["ngRoute"])
  .service("Session", function() {
      this.create = (sessionId, userId) => {
          this.id = sessionId;
          this.userId = userId;
      };

      this.destroy = () => {
          this.id = null;
          this.userId = null;
      };
  });
