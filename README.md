# Color Palettes

Color Palettes is a simple property editor that let you define different color palettes (or get them from [Adobe Kuler](https://color.adobe.com/) or [COLOURlovers](http://www.colourlovers.com/)) and present them to the editor as a list of radio buttons.

It is also possible to request defined color palettes from Adobe Kuler or COLOURlovers by entering the theme/palette id.

To use the selected palette in your razor view add the following namespaces:

```
@using Our.Umbraco.ColorPalettes.Models;
@using Our.Umbraco.ColorPalettes.Converters;
````

#### Get selected palette
###### Strongly typed example
```
ColorPalette palette = Model.Content.GetPropertyValue<ColorPalette>("theme");
var colors = palette.Colors;
````
###### Dynamic example
```
ColorPalette palette = (ColorPalette)CurrentPage.theme;
var colors = palette.Colors;
```
or
```
var colors = ((ColorPalette)CurrentPage.theme).Colors;
```

#### Loop through each color defined in the palette

```
@foreach (var color in palette.Colors)
{
        @color.Code;
}
```

#### Get a specific color in the palette

```
string color1 = palette.Colors.ElementAt(0).Code,
       color2 = palette.Colors.ElementAt(1).Code,
       color3 = palette.Colors.ElementAt(2).Code,
       color4 = palette.Colors.ElementAt(3).Code,
       color5 = palette.Colors.ElementAt(4).Code;
```

#### Export/Import JSON format
```
[
  {
    "name": "Summer Watermelon",
    "alias": "summer-watermelon",
    "colors": [
      {
        "name": null,
        "code": "#FE495F"
      },
      {
        "name": null,
        "code": "#FE9D97"
      },
      {
        "name": null,
        "code": "#FFFEC8"
      },
      {
        "name": null,
        "code": "#D8FD94"
      },
      {
        "name": null,
        "code": "#BDED7E"
      }
    ]
  },
  {
    "name": "Vintage",
    "alias": "vintage",
    "colors": [
      {
        "name": null,
        "code": "#566F6E"
      },
      {
        "name": null,
        "code": "#659A91"
      },
      {
        "name": null,
        "code": "#BBCEB0"
      },
      {
        "name": null,
        "code": "#F8F2C1"
      },
      {
        "name": null,
        "code": "#906B61"
      }
    ]
  },
  {
    "name": "Ice Coffee",
    "alias": "ice-coffee",
    "colors": [
      {
        "name": null,
        "code": "#D9D6C7"
      },
      {
        "name": null,
        "code": "#BFB8A3"
      },
      {
        "name": null,
        "code": "#A69677"
      },
      {
        "name": null,
        "code": "#8C7961"
      },
      {
        "name": null,
        "code": "#26150F"
      }
    ]
  }
]
```
