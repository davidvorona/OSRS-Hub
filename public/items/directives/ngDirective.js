const ngDirective = ($parameter) => {
    return {
      // directive logic here
      // simply add directive name to app.js
    };
};

angular.module("ngDirective", [])
  .directive("ngDirective", ngDirective);
