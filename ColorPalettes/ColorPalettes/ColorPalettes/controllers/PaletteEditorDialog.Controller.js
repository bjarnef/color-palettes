angular.module("umbraco").controller("Our.Umbraco.ColorPalettes.PaletteEditDialog.Controller", function ($scope, $filter, $timeout, colorPalettesResource) {

    var nameAlreadyChanged = false;

    $scope.heading = "Edit Palette";
    $scope.palettePlaceholderText = "Enter palette id";
    $scope.showthirdPartyPalette = false;

    $scope.paletteData = angular.copy($scope.dialogData) || {};

    if (!$scope.paletteData.name) {
        $scope.paletteData.name = null;
    } else {
        // if paletteData.name has a value from beginning we won't update alias
        nameAlreadyChanged = true;
    }

    if (!$scope.paletteData.alias)
        $scope.paletteData.alias = null;
    
    if (!$scope.paletteData.colors) {

        if (!$scope.paletteData.colors) {
            $scope.paletteData.colors = [{
                name: "",
                code: ""
            }];
        }
    }

    $scope.updatePaletteSource = function () {
        if ($scope.paletteSource == 'kuler') {
            $scope.palettePlaceholderText = "Enter theme id";
        }
        else {
            $scope.palettePlaceholderText = "Enter palette id";
        }
    }

    if (!$scope.paletteData.name && !$scope.paletteData.alias) {
        $scope.heading = "Create New Palette";
    }
    
    $scope.updatePaletteName = function () {
        if (!nameAlreadyChanged) {
            $scope.paletteData.alias = $filter('camelCase')($scope.paletteData.name);
        }
    }

    $scope.updatePaletteAlias = function () {
        nameAlreadyChanged = true;
    }

    $scope.addColor = function () {
        $scope.paletteData.colors.push({
            name: "",
            code: ""
        });
    };

    $scope.remove = function (color) {
        var index = $scope.paletteData.colors.indexOf(color);
        if (color.code == '' && color.name == '') {
            $scope.paletteData.colors.splice(index, 1);
        }
        else if (confirm('Are you sure you want to remove this color?')) {
            $scope.paletteData.colors.splice(index, 1);
        }
    };

    $scope.canRemoveRow = function () {
        return ($scope.paletteData.colors.length > 1);
    }

    $scope.showReqError = false;
    $scope.showReqNoResults = false;
    $scope.showReqPreloader = false;

    $scope.getPalette = function (id, source) {
        $scope.showReqPreloader = true;

        colorPalettesResource.getPalette(id, source)
            .success(function (data) {

                // change variable as we have fetched the name (and generate alias from it)
                nameAlreadyChanged = true;
                
                var palette;
                var jsonStr = angular.fromJson(data);

                if (jsonStr.length > 0) {
                    palette = JSON.parse(jsonStr);
                }

                // update paletteData if requested palette has property values
                if (palette != null && (palette.name || palette.alias || palette.colors)) {
                    
                    $timeout(function () {
                        $scope.paletteData = palette;

                        if ($scope.paletteData != null && $scope.paletteData.name != null)
                            $scope.paletteData.alias = $filter('camelCase')($scope.paletteData.name);

                        $scope.showReqPreloader = false;
                    }, 1500);

                } else {
                    $scope.paletteSuccessMsg = "No results were found.";

                    var timer = $timeout(function () {
                        $scope.showReqPreloader = false;
                        $scope.showReqNoResults = true;
                    }, 1500);

                    timer.then(function () {
                        $timeout(function () {
                            $scope.showReqNoResults = false;
                        }, 3000);
                    });
                }
            }).
            error(function (data) {
                $scope.showReqPreloader = false;
                $scope.showReqError = true;
                $scope.paletteError = "Sorry, an error occurred while processing your request.";

                $timeout(function() {
                    $scope.showReqError = false;
                }, 3000);
            });
    }

    //sort config  
    $scope.sortableOptions = {
        axis: 'y',
        cursor: "move",
        handle: ".handle",
        cancel: ".no-drag, .unsortable",
        containment: "parent",
        items: "li:not(.unsortable)",
        //placeholder: 'sortable-placeholder',
        forcePlaceholderSize: true,
        start: function (ev, ui) {
            var elem = angular.element(ui.item);
            elem.find("a.remove").css('visibility', 'hidden');
            elem.css('z-index', '100');
            elem.parents(".color-rows").next("#cp-overlay").show();
        },
        update: function (ev, ui) {
            //console.log(ui);
            //if (ui.item.length <= 1) {
            //    ui.item.sortable.cancel();
            //}
        },
        stop: function (ev, ui) {
            var elem = angular.element(ui.item);
            elem.find("a.remove").css('visibility', 'visible');
            elem.parents(".color-rows").next("#cp-overlay").hide();
        },
        sort: function (ev, ui) {
            /* 
                Ensure dragged elements are re-positioned when overlap half the size of the dragged element
                http://stackoverflow.com/questions/10637095/jquery-ui-sortable-tolerance-option-not-working-as-expected
                This is for vertical sortable, for for a horizontal one change outerHeight to outerWidth and position.top to position.left everywhere.
            */

            var that = $(this),
                h = ui.helper.outerHeight();

            that.children().each(function () {
                if ($(this).hasClass('ui-sortable-helper') || $(this).hasClass('ui-sortable-placeholder'))
                    return true;
                // If overlap is more than half of the dragged item
                var dist = Math.abs(ui.position.top - $(this).position().top),
                    before = ui.position.top > $(this).position().top;
                if ((h - dist) > (h / 2) && (dist < h)) {
                    if (before)
                        $('.ui-sortable-placeholder', that).insertBefore($(this));
                    else
                        $('.ui-sortable-placeholder', that).insertAfter($(this));
                    return false;
                }
            });
        }
    };
});