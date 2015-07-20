angular.module('umbraco.filters').filter('camelCase', function () {
    var camelCaseFilter = function (input) {
        var words = input.split(' ');
        for (var i = 0, len = words.length; i < len; i++)
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        return words.join(' ');
    };
    return camelCaseFilter;
})