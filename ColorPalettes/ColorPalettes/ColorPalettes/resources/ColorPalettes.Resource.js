angular.module("umbraco.resources")
    .factory("colorPalettesResource", function ($http, $cookieStore) {
        return {
        	getPalette: function (id, source) {
        		if (source == "colourlovers") {
        		    return $http.get("backoffice/ColorPalettes/Palettes/GetColourLoversPalette/" + id);
        		}
        		if (source == "kuler") {
        		    return $http.get("backoffice/ColorPalettes/Palettes/GetKulerPalette/" + id);
        		}
				return "";
        	}
        };
    });