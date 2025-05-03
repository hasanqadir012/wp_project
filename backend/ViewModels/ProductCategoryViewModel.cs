using System.Collections.Generic;

namespace MyWebsite.Models
{
    public class ProductCategoryViewModel
    {
        public List<Product> Products { get; set; }
        public List<Category> Categories { get; set; }
        public string SelectedCategory { get; set; }
    }
}
