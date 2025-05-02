using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace labs.Models
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
        [StringLength(20)]
        public string OrderStatus { get; set; }  

        [ForeignKey("ShippingAddress")]
        [Required]
        public int ShippingAddressId { get; set; }

        [ForeignKey("BillingAddress")]
        [Required]
        public int BillingAddressId { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; }  

        [Required]
        [StringLength(50)]
        public string TransactionId { get; set; } 

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }  

        public virtual Address ShippingAddress { get; set; }
        public virtual Address BillingAddress { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; }
    }
}