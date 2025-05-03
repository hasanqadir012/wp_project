using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MyWebsite.Models
{
    public class OrderItem  
    {
        [Key]
        [Required]
        [RegularExpression("^[1-9][0-9]{4}$", ErrorMessage = "Order item ID must be 5 digits (1-9)")]
        public int OrderItemId { get; set; }  

        [ForeignKey("Order")]  
        [Required]
        public int OrderId { get; set; }  

        [ForeignKey("Product")]  
        [Required]
        public int ProductId { get; set; } 

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be a positive, non-zero number")]
        public int Quantity { get; set; }  

        [Required]
        [Range(100, 999, ErrorMessage = "Unit price must be between 100-999 shekels")]
        public int UnitPrice { get; set; }  

        public virtual Order Order { get; set; }
        public virtual Product Product { get; set; }
    }
}