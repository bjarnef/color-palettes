using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Our.Umbraco.ColorPalettes.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Xml;
using Umbraco.Web.Editors;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace Our.Umbraco.ColorPalettes.Controllers
{
    [PluginController("ColorPalettes")]
    public class PalettesController : UmbracoAuthorizedJsonController
    {
        /// <summary>
        /// Get palette from Kuler
        /// </summary>
        /// <param name="id">Theme id</param>
        /// <returns></returns>
        public string GetKulerPalette(int id)
        {
            // example to get a palette from Kuler: http://kuler-api.adobe.com/rss/search.cfm?searchQuery=themeID:1367601&key=[key]

            string queryVariable = "themeID:" + id;
            XmlDocument doc = new XmlDocument();
            HttpWebRequest r = (HttpWebRequest)HttpWebRequest.Create("http://kuler-api.adobe.com/rss/search.cfm?searchQuery=" + queryVariable + "&key=[key]");
            //r.Method = "POST";

            //string bodyRequest = "";
            //using (Stream writeStream = r.GetRequestStream())
            //{
            //    UTF8Encoding encoding = new UTF8Encoding();
            //    byte[] bytes = encoding.GetBytes(bodyRequest);
            //    writeStream.Write(bytes, 0, bytes.Length);
            //}
            try
            {
                using (HttpWebResponse response = (HttpWebResponse)r.GetResponse())
                {
                    using (Stream responseStream = response.GetResponseStream())
                    {
                        using (StreamReader readStream = new StreamReader(responseStream, Encoding.UTF8))
                        {
                            doc.Load(readStream);
                        }
                    }
                }

                XmlNamespaceManager nsmgr = new XmlNamespaceManager(doc.NameTable);
                nsmgr.AddNamespace("kuler", "http://kuler.adobe.com/kuler/API/rss/");

                XmlNodeList xmllist = doc.SelectNodes("rss/channel/item", nsmgr);

                ColorPalette palette = new ColorPalette();
                List<Color> colorlist = new List<Color>();

                foreach (XmlNode i in xmllist)
                {
                    XmlNode xmldetail = i.SelectSingleNode("kuler:themeItem[kuler:themeID='" + id + "']", nsmgr); // 1367601
                    if (xmldetail != null)
                    {
                        string title = xmldetail.SelectSingleNode("kuler:themeTitle", nsmgr).InnerText;
                        palette.Name = title;
                        palette.Alias = title.ToLower().Replace(" ", "-");

                        XmlNodeList xmlColors = xmldetail.SelectNodes("kuler:themeSwatches/kuler:swatch/kuler:swatchHexColor", nsmgr);

                        foreach (XmlNode hex in xmlColors)
                        {                     
                            Color color = new Color();
                            color.Code = "#" + hex.InnerText;
                            colorlist.Add(color);
                        }
                        palette.Colors = colorlist;
                    }
                }

                var jsonSettings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };
                
                return JsonConvert.SerializeObject(palette, jsonSettings);
            }
            catch (WebException ex)
            {
                //Handle exception
            }

            return "";
        }

        /// <summary>
        /// Get palette from COLOURLovers
        /// </summary>
        /// <param name="id">Palette id</param>
        /// <returns></returns>
        public string GetColourLoversPalette(int id)
        {
            // example to get a palette from COLOURLovers: http://www.colourlovers.com/api/palette/1367601

            XmlDocument doc = new XmlDocument();
            HttpWebRequest r = (HttpWebRequest)HttpWebRequest.Create("http://www.colourlovers.com/api/palette/" + id);
            r.Method = "POST";

            string bodyRequest = "";
            using (Stream writeStream = r.GetRequestStream())
            {
                UTF8Encoding encoding = new UTF8Encoding();
                byte[] bytes = encoding.GetBytes(bodyRequest);
                writeStream.Write(bytes, 0, bytes.Length);
            }
            try
            {
                using (HttpWebResponse response = (HttpWebResponse)r.GetResponse())
                {
                    using (Stream responseStream = response.GetResponseStream())
                    {
                        using (StreamReader readStream = new StreamReader(responseStream, Encoding.UTF8))
                        {
                            doc.Load(readStream);
                        }
                    }
                }

                XmlNodeList xmllist = doc.SelectNodes("//palettes");

                ColorPalette palette = new ColorPalette();
                List<Color> colorlist = new List<Color>();

                foreach (XmlNode i in xmllist)
                {
                    XmlNode xmldetail = i.SelectSingleNode("palette[id='" + id + "']"); // 1367601
                    if (xmldetail != null)
                    {
                        string title = xmldetail.SelectSingleNode("title").InnerText;
                        palette.Name = title;
                        palette.Alias = title.ToLower().Replace(" ", "-");

                        XmlNode xmlColors = xmldetail.SelectSingleNode("colors");

                        foreach (XmlNode hex in xmlColors)
                        {
                            Color color = new Color();
                            color.Code = "#" + hex.InnerText;
                            colorlist.Add(color);
                        }
                        palette.Colors = colorlist;
                    }
                }

                var jsonSettings = new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() };

                return JsonConvert.SerializeObject(palette, jsonSettings);
            }
            catch (WebException ex)
            {
                //Handle exception
            }

            return "";
        }
    }
}