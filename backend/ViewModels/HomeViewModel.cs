using MyWebsite.Models;
using System.Collections.Generic;

namespace MyWebsite.ViewModels
{
    public class HomeViewModel
    {
        public List<Product> FeaturedProducts { get; set; }
        public List<Product> NewArrivals { get; set; }
        public List<Category> Categories { get; set; }
    }
}