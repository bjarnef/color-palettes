# Color Palettes

Color Palettes is a simple property editor that let you define different color palettes (or get them from [Adobe Kuler](https://color.adobe.com/) or [COLOURlovers](http://www.colourlovers.com/)) and present them to the editor as a list of radio buttons.

It is also possible to request defined color palettes from Adobe Kuler or COLOURlovers by entering the theme/palette id.

To use the selected palette in your razor view add the following namespaces:

```
@using Our.Umbraco.ColorPalettes.Models;
@using Our.Umbraco.ColorPalettes.Converters;
````

#### Get selected palette

```
ColorPalette palette = Model.Content.GetPropertyValue<ColorPalette>("theme");
````

#### Loop through each color defined in the palette

```
@foreach (var color in palette.Colors)
{
        @color.Code;
}
````

#### Get a specific color in the palette

```
string color1 = palette.Colors.ElementAt(0).Code,
       color2 = palette.Colors.ElementAt(1).Code,
       color3 = palette.Colors.ElementAt(2).Code,
       color4 = palette.Colors.ElementAt(3).Code,
       color5 = palette.Colors.ElementAt(4).Code;
````
