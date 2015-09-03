var app = angular.module("umbraco");
app.requires.push('fileSaver');

app.directive('paletteDownload', function ($compile, SaveAs) {
        return {
            restrict: 'AE',
            scope: {
                data: '=',
                text: '@',
                isDisabled: '='
            },
            link: function (scope, elm, attrs) {

                var date = new Date(),
                    month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1),
                    day = (date.getDate() + 1) > 9 ? (date.getDate() + 1) : "0" + (date.getDate() + 1),
                    hours = (date.getHours()) > 9 ? (date.getHours()) : "0" + (date.getHours()),
                    minutes = (date.getMinutes()) > 9 ? (date.getMinutes()) : "0" + (date.getMinutes()),
                    seconds = (date.getSeconds()) > 9 ? (date.getSeconds()) : "0" + (date.getSeconds()),
                    dateFormatted = month + "-" + day + "-" + date.getFullYear() + "-" + hours + ":" + minutes + ":" + seconds;

                var buttonText = scope.text ? scope.text : "Download",
                    isDisabled = (angular.isDefined(scope.isDisabled)) ? 'ng-disabled="isDisabled"' : null;

                scope.onHandleClick = function () {

                    var json = scope.data,
                        blob = new Blob([json], { type: "application/json;charset=utf-8" }),
                        filename = "palettes";

                    var options = { type: "application/json;charset=utf-8" };
                    SaveAs.download(blob, filename + '-' + dateFormatted + '.json', options);
                };

                elm.append($compile(
                        '<button type="button" class="btn btn-small" ' + isDisabled + ' ng-click="onHandleClick()">' +
                        '<i class="icon-download-alt"></i> ' + buttonText +
                        '</button>'
                )(scope));

                //scope.$watch('isDisabled', function (newVal) {
                //    console.log("scope.isDisabled", newVal);

                //    elm.children()[0].attr('disabled', newVal);
                //});

                //scope.$parent.$watch(attrs.ngDisabled, function (newVal) {
                //    console.log("attrs.ngDisabled", newVal);
                //});
            }
        };
    });