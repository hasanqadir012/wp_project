using backend.Models;

namespace backend.ViewModels
{
    public class ShopViewModel
    {
        public List<Product> Products { get; set; }
        public string CurrentCategory { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public List<Category> Categories { get; set; }
    }
}