using System.Collections.Generic;
using backend.Models;

namespace backend.ViewModels
{
    public class ProductCategoryViewModel
    {
        public List<Product> Products { get; set; }
        public List<Category> Categories { get; set; }
        public string SelectedCategory { get; set; }
    }
}
