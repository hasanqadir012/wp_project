using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace labs.Models
{
    public class Product  
    {
        [Key]
        [Required]
        [RegularExpression("^[1-9]\\d{4}$", ErrorMessage = "Product ID must be 5 digits (1-9)")]
        public int ProductId { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be 2-100 characters")]
        [RegularExpression("^[A-Za-z][A-Za-z0-9\\s]*$", 
            ErrorMessage = "Name must start with a letter and can contain letters, numbers and spaces")]
        public string Name { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 10, ErrorMessage = "Description must be 10-1000 characters")]
        public string Description { get; set; }

        [Required]
        [Range(1500, 100000, ErrorMessage = "Price must be between RS 1500- Rs 10000")]
        [DataType(DataType.Currency)]
        public decimal Price { get; set; }  


        // [Required]
        // [RegularExpression("^[1-9]\\d{4}$", ErrorMessage = "SKU must be 5 digits (1-9)")]
        // public int SKU { get; set; }  // stock keeping unit(e.g IPHONE15-128GB-BLACK)

        [ForeignKey("Category")]
        [Required]
        public int CategoryId { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative")]
        public int StockQuantity { get; set; }  

        [Required]
        public bool IsAvailable { get; set; }  

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime UpdatedAt { get; set; }

        [Required]
        [Url(ErrorMessage = "Please enter a valid image URL")]
        [StringLength(500, ErrorMessage = "Image URL cannot exceed 500 characters")]
        public string ImageUrl { get; set; }  


        public virtual Category Category { get; set; }
    }
}