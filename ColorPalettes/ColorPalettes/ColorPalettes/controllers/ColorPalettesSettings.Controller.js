angular.module("umbraco").controller("Our.Umbraco.ColorPalettes.Settings.Controller", function ($scope, $timeout, notificationsService, dialogService, angularHelper, localizationService) {

    var editDialog = null;

    //$scope.model.value = "";
    //console.log($scope.model.value);

    $scope.palettes = angular.fromJson($scope.model.value) || [];

    //init the model
    $scope.model.value = $scope.model.value || $scope.palettes;

    $scope.addPalette = function () {

        if (editDialog) {
            editDialog.close();
        }
        
        editDialog = dialogService.open({
            template: '/App_Plugins/ColorPalettes/views/PaletteEditDialog.html',
            show: true,
            dialogData: null,
            callback: done
        });

        function done(data) {
            if (data.name && data.alias && data.colors) {
                // check if alias already exists
                var addToObject = true;
                for (var i = 0; i < $scope.palettes.length; i++) {
                    if ($scope.palettes[i].alias === data.alias) {
                        addToObject = false;
                    }
                }

                if (addToObject) {
                    $scope.palettes.push(data);
                    notificationsService.success("Success", "Palette has been created. Remember to save changes!");
                }
                else {
                    notificationsService.error("Palette alias already exists!");
                }
                //$scope.palettes.push({ name: palette.name, alias: palette.alias, colors: palette.colors });
            }
        }
    }

    $scope.editPalette = function (palette) {

        if (editDialog) {
            editDialog.close();
        }

        editDialog = dialogService.open({
            template: '/App_Plugins/ColorPalettes/views/PaletteEditDialog.html',
            show: true,
            dialogData: palette,
            callback: done,
        });

        function done(data) {
            if (data.name && data.alias && data.colors) {

                for (var i = 0; i < $scope.palettes.length; i++) {
                    if ($scope.palettes[i].alias == data.alias) {
                        $scope.palettes[i] = { name: data.name, alias: data.alias, colors: data.colors };
                        break;
                    }
                }
            }
        }
    }

    $scope.removePalette = function (palette) {
        var index = $scope.palettes.indexOf(palette);
        if (confirm('Are you sure you want to remove this palette?')) {
            $scope.palettes.splice(index, 1);
        }
    }

    //sync things up on save
    $scope.$on("formSubmitting", function (ev, args) {
        $scope.model.value = angular.toJson($scope.palettes);
    });

    //sort config  
    $scope.sortableOptions = {
        axis: 'y',
        cursor: "move",
        handle: ".handle",
        tolerance: "pointer",
        cancel: ".no-drag",
        containment: "parent",
        items: "li:not(.unsortable)",
        placeholder: 'sortable-placeholder',
        forcePlaceholderSize: true,
        update: function (ev, ui) {

        },
        stop: function (ev, ui) {

        }
    };

});