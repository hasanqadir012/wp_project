using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserRegisterViewModel
    {
        [Required]
        [StringLength(20, MinimumLength = 3)]
        [RegularExpression("^[A-Za-z][A-Za-z0-9]+$", 
            ErrorMessage = "Username must start with a letter and contain only letters and numbers")]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; }

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50)]
        public string LastName { get; set; }

        [Required]
        [Phone]
        [StringLength(15)]
        public string PhoneNumber { get; set; }

        [EmailAddress]
        public string Email { get; set; }
    }
}
