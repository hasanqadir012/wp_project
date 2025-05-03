using System.ComponentModel.DataAnnotations;

namespace backend.ViewModels
{
    public class UserLoginViewModel
    {
        [Required]
        [StringLength(20, MinimumLength = 3)]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }
}
