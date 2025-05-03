using backend.Models;

namespace backend.ViewModels
{
    public class HomeViewModel
    {
        public List<Product> FeaturedProducts { get; set; }
        public List<Product> NewArrivals { get; set; }
        public List<Category> Categories { get; set; }
    }
}