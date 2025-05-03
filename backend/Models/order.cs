using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MyWebsite.Models
{
    public class Order
    {
        [Key]
        [Required]
        [RegularExpression("^[1-9][0-9]{4}$", ErrorMessage = "Order ID must be 5 digits (1-9)")]
        public int OrderId { get; set; } 

        [Required]
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime OrderDate { get; set; }  

        [Required]
        [Range(1500, 100000, ErrorMessage = "Total amount must be between 1500-100000 rupees")]
        public decimal TotalAmount { get; set; }  


        [Required]
        public OrderStatus OrderStatus { get; set; }

        [Required]
        public int ShippingAddressId { get; set; }

        [Required]
        public int BillingAddressId { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; }  

        [Required]
        [StringLength(50)]
        public string TransactionId { get; set; } 

        [ForeignKey("User")]
        [Required]
        [RegularExpression("^[1-9]\\d{4}$", ErrorMessage = "User ID must be 5 digits (1-9)")]
        public int UserId {get; set;}

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }  

        [Required]
        [DataType(DataType.DateTime)]
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:mm:ss}", ApplyFormatInEditMode = true)]
        public DateTime updatedAt { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
        public virtual User User { get; set; }

    }
}