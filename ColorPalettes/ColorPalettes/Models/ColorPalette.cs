using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Our.Umbraco.ColorPalettes.Models
{
    public class ColorPalette
    {
        /// <summary>
        /// The name of the current palette.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The alias of the current palette.
        /// </summary>
        public string Alias { get; set; }

        /// <summary>
        /// The list of the current colors.
        /// </summary>
        public List<Color> Colors { get; set; }
    }
}