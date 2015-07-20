angular.module("umbraco").controller("Our.Umbraco.ColorPalettes.Editor.Controller", function ($scope, $timeout, angularHelper) {

    var alreadyDirty = false;
    $scope.model.value = $scope.model.value || {};

    // init selected palette
    $scope.selectedPalette = angular.fromJson($scope.model.value);

    //if (!($scope.model.value instanceof Array))
    //    $scope.model.value = [];

    $scope.palettes = angular.fromJson($scope.model.config.palettes);

    $scope.selectPalette = function (palette) {
        $scope.selectedPalette = palette;
        $scope.model.value = angular.toJson($scope.selectedPalette, true);
    }

    // check if selected palette has changed
    $scope.$watch('selectedPalette', function (newval, oldval) {
        //console.log(newval, oldval);

        if (newval !== oldval) {
            //run after DOM is loaded
            $timeout(function () {
                if (!alreadyDirty) {
                    var currForm = angularHelper.getCurrentForm($scope);
                    currForm.$setDirty();
                    alreadyDirty = true;
                }
            }, 0);
        }
    }, true);

});