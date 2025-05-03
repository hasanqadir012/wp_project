namespace backend.ViewModels
{
    public class ProductViewModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public int StockQuantity { get; set; }
        public bool IsAvailable { get; set; }
        public IFormFileCollection Images { get; set; }
    }
}