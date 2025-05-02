using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace labs.Models
{
    public class Category 
    {
        [Key]
        [Required]
        [RegularExpression("^[1-9][0-9]{4}$", ErrorMessage = "Category ID must be 5 digits (1-9)")]
        public string CategoryId { get; set; }

        [Required]
        [RegularExpression("^[A-Za-z][A-Za-z0-9\\s]*$", 
            ErrorMessage = "Name must start with a letter and can contain letters, numbers, and spaces")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2-100 characters")]
        public string Name { get; set; }


    }
}