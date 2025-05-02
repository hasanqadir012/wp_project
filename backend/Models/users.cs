using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace labs.Models
{
    public class User  
    
        [Key]
        [Required]
        [RegularExpression("^[1-9]\\d{4}$", ErrorMessage = "User ID must be 5 digits (1-9)")]
        public int UserId { get; set; } 

        [Required]
        [StringLength(20, MinimumLength = 3, ErrorMessage = "Username must be 3-20 characters")]
        [RegularExpression("^[A-Za-z][A-Za-z0-9]+$", 
            ErrorMessage = "Username must start with a letter and contain only letters and numbers")]
        [Index(IsUnique = true)]  
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters")]
        public string Password { get; set; } 

        [Required]
        [StringLength(50, ErrorMessage = "First name cannot exceed 50 characters")]
        public string FirstName { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "Last name cannot exceed 50 characters")]
        public string LastName { get; set; }

        [Required]
        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(15, ErrorMessage = "Phone number cannot exceed 15 digits")]
        public string PhoneNumber { get; set; }  

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? LastLogin { get; set; } 

        [EmailAddress(ErrorMessage = "Invalid email address")]
        public string Email { get; set; }
    }
}