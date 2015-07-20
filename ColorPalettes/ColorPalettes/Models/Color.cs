using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Our.Umbraco.ColorPalettes.Models
{
    /// <summary>
    /// Model class to represent a color
    /// </summary>
    public class Color
    {
        /// <summary>
        /// The name of the current color.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// The value of the current color.
        /// </summary>
        public string Code { get; set; }
    }
}