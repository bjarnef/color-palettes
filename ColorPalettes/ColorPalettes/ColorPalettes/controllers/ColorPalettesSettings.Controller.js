var app = angular.module("umbraco");

app.requires.push('ngFileUpload');

app.controller("Our.Umbraco.ColorPalettes.Settings.Controller", function ($scope, $timeout, notificationsService, dialogService, angularHelper, localizationService, Upload) {
    
    var editDialog = null;
    var alreadyDirty = false;

    //$scope.model.value = "";
    //console.log($scope.model.value);
    
    //init the palettes
    $scope.palettes = angular.fromJson($scope.model.value) || [];

    // Blob support
    $scope.isBlobSupported = function () {
        var isFileSaverSupported;

        try {
            isFileSaverSupported = !!new Blob;
        }
        catch (e) {
            isFileSaverSupported = false;
        }

        return isFileSaverSupported;
    };

    /* used for choosing palettes to export */
    var exportConfig = {};
    $scope.exportConfig = exportConfig;

    exportConfig.allItemsSelected = false;

    // Fired when an entity in the table is checked
    $scope.selectPalette = function () {
        // If any entity is not checked, then uncheck the "allItemsSelected" checkbox
        for (var i = 0; i < $scope.palettes.length; i++) {
            if (!$scope.palettes[i].isChecked) {
                exportConfig.allItemsSelected = false;
                return;
            }
        }

        // ... otherwise ensure that the "allItemsSelected" checkbox is checked
        exportConfig.allItemsSelected = true;
    };

    $scope.selectAll = function () {
        // Loop through all the entities and set their isChecked property
        for (var i = 0; i < $scope.palettes.length; i++) {
            $scope.palettes[i].isChecked = exportConfig.allItemsSelected;
        }
    };

    $scope.anySelected = function () {
        for (var i = 0; i < $scope.palettes.length; i++) {
            if ($scope.palettes[i].isChecked == true) {
                return true;
            }
        }
        return false;
    };

    $scope.countSelected = function () {
        var count = 0;
        for (var i = 0; i < $scope.palettes.length; i++) {
            if ($scope.palettes[i].isChecked == true) {
                count++;
            }
        }
        return count;
    };

    /* --------------------------------- */

    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };

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

    $scope.getPalettesToExport = function () {
        var array = [];
        for (var i = 0; i < $scope.palettes.length; i++) {
            if ($scope.palettes[i].isChecked == true) {
                var _palette = angular.copy($scope.palettes[i]);

                //remove properties from output
                delete _palette.isChecked;
                delete _palette.selection;

                array.push(_palette);
            }
        }
        
        var json = angular.toJson(array, true);
        return json;
    }

    $scope.exportPalette = function (palette) {
        var _palette = angular.copy(palette);

        //remove property from output
        delete _palette.isChecked;

        var array = [];
        array.push(_palette);
        var json = angular.toJson(array, true);
        return json;
    }

    //sync things up on save
    $scope.$on("formSubmitting", function (ev, args) {
        for (var i = 0; i < $scope.palettes.length; i++) {
            delete $scope.palettes[i].isChecked;
        }
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

    $scope.uploadFiles = function (file) {
        $scope.f = file;
        //console.log($scope.f);
        
        if (file && file.$error == 'pattern') {
            notificationsService.error("Error", "Invalid file type - only .txt or .json allowed.");
            return;
        }

        if (file && !file.$error) {
            var reader = new FileReader();

            reader.readAsText(file);

            reader.onloadend = function () {
                var result = reader.result;

                if (!isJson(result)) {
                    notificationsService.error("Error", "The file does not contain valid JSON.");
                    return;
                }

                var importedPalettes = angular.fromJson(JSON.parse(result));
                //console.log("importedPalettes", importedPalettes);

                var importCount = 0,
                    importErrorCount = 0;

                for (var i = 0; i < importedPalettes.length; i++) {
                    //console.log(importedPalettes[i]);
                    
                    // check if palette alias already exists
                    var found = false;
                    for (var j = 0; j < $scope.palettes.length; j++) {
                        if ($scope.palettes[j].alias == importedPalettes[i].alias) {
                            found = true;
                            importErrorCount++;
                            break;
                        }
                    }

                    // add palette is not existing alias was found
                    if (!found) {
                        $scope.palettes.push(importedPalettes[i]);
                        importCount++;
                    }
                }

                $scope.model.value = angular.toJson($scope.palettes);

                if (importErrorCount > 0) {
                    var errorCountText = importErrorCount + " " + (importErrorCount == 1 ? "palette" : "palettes");
                    notificationsService.error("Error", errorCountText + " were not imported, because palette alias(es) were found!");
                }

                if (importCount > 0) {
                    var importCountText = importCount + " new " + (importCount == 1 ? "palette" : "palettes");
                    notificationsService.success("Success", importCountText + " has been imported. Remember to save changes!");
                }
            }
        }
    };

    // test if model.value has changed
    $scope.$watch('model.value', function (newval, oldval) {
        //console.log(newval, oldval);

        if (newval !== oldval) {
            $timeout(function () {
                if (!alreadyDirty) {
                    var currForm = angularHelper.getCurrentForm($scope);
                    currForm.$setDirty();
                    alreadyDirty = true;
                }
            }, 0);
        }
    });

});