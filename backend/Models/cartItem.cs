using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace backend.Models
{
    public class CartItem
    {
        [Key]
        [Required]
        [RegularExpression("^[1-9][0-9]{4}$", ErrorMessage = "Serial number must be 5 digits (1-9)")]
        public int cartItemId { get; set; }

        [ForeignKey("User")]  
        [Required]
        [RegularExpression("^[1-9][0-9]{4}$", ErrorMessage = "User ID must be 5 digits (1-9)")]
        public int userId { get; set; }

        [Required]
        [RegularExpression("^[1-9][0-9]{2}$", ErrorMessage = "Product ID must be 3 digits (100-999)")]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be a positive, non-zero number")]
        public int quantity { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:mm:ss}", ApplyFormatInEditMode = true)]
        public DateTime addedAt { get; set; }

        public virtual User User { get; set; }
    }
}