app.controller('LayoutController', LayoutController);

LayoutController.$inject = [
  '$scope',
  'config'
];

function LayoutController ($scope, config) {
  $scope.config = config;
}
