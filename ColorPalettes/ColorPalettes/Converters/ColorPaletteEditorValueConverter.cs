using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Our.Umbraco.ColorPalettes.Models;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web;

namespace Our.Umbraco.ColorPalettes.Converters
{
        /// <summary>
        /// Value converter class to convert a json key value pairs object
        /// to a strongly typed key value pairs instance.
        /// </summary>
        [PropertyValueType(typeof(ColorPalette))]
        [PropertyValueCache(PropertyCacheValue.All, PropertyCacheLevel.Content)]
        public class ColorPaletteEditorValueConverter : PropertyValueConverterBase
        {
            /// <summary>
            /// Method to convert a property value to an instance
            /// of the key value pairs class.
            /// </summary>
            /// <param name="propertyType">The current published property
            /// type to convert.</param>
            /// <param name="source">The original property data.</param>
            /// <param name="preview">True if in preview mode.</param>
            /// <returns>An instance of the key value pairs class.</returns>
            public override object ConvertDataToSource(PublishedPropertyType propertyType, object source, bool preview)
            {
                if (source == null)
                    return null;

                if (UmbracoContext.Current == null)
                    return null;

                var retval = new ColorPalette();

                var palette = JsonConvert.DeserializeObject<ColorPalette>(source.ToString());
                if (palette == null || palette.Colors.Count < 0)
                    return retval;

                var colors = new List<Color>();

                foreach (var color in palette.Colors) {
                    colors.Add(color);
                }

                retval.Name = palette.Name;
                retval.Alias = palette.Alias;
                retval.Colors = colors;

                return retval;
            }

            /// <summary>
            /// Method to see if the current property type is of type
            /// key value editor.
            /// </summary>
            /// <param name="propertyType">The current property type.</param>
            /// <returns>True if the current property type of of type
            /// key value editor.</returns>
            public override bool IsConverter(PublishedPropertyType propertyType)
            {
                return propertyType.PropertyEditorAlias.Equals("Our.Umbraco.ColorPalettes");
            }
        }
}