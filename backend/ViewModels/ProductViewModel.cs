using System.ComponentModel.DataAnnotations;

namespace backend.ViewModels
{
    public class ProductViewModel
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public string CategoryName { get; set; }
        [Required]
        public int StockQuantity { get; set; }
        [Required]
        public bool IsAvailable { get; set; }
        public IFormFileCollection? Images { get; set; }
    }
}