using System.ComponentModel.DataAnnotations;

namespace backend.ViewModels
{
    public class CheckoutViewModel
    {
        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public List<CartItemViewModel> CartItems { get; set; }

        [Required]
        public AddressViewModel ShippingAddress { get; set; }

        [Required]
        public AddressViewModel BillingAddress { get; set; }
    }

    public class CartItemViewModel
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }

    public class AddressViewModel
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [Required]
        [StringLength(15)]
        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        [StringLength(200)]
        public string AddressLine1 { get; set; }

        [StringLength(200)]
        public string? AddressLine2 { get; set; }

        [Required]
        [StringLength(100)]
        public string City { get; set; }

        [Required]
        [StringLength(100)]
        public string State { get; set; }

        [Required]
        [StringLength(20)]
        public string PostalCode { get; set; }

        [Required]
        [StringLength(100)]
        public string Country { get; set; }
    }
}