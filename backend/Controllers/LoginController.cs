using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Data;
using backend.Services;
using backend.ViewModels;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DataLayers _context;
        private readonly IEncryption _encryption;
        private readonly IJwtService _jwtService;

        public LoginController(DataLayers context, IEncryption encryption, IJwtService jwtService)
        {
            _context = context;
            _encryption = encryption;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var encryptedPassword = _encryption.Encrypt(model.Password);
            var user = _context.Users.FirstOrDefault(u => u.Username == model.Username && u.Password == encryptedPassword);

            if (user != null)
            {
                var token = _jwtService.GenerateToken(user);

                return Ok(new {
                    token = token,
                    user = user.Username,
                    isAdmin = user.IsAdmin,
                    message = "Login successful"
                });
            }

            return Unauthorized(new { message = "Invalid login attempt." });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] UserRegisterViewModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = _context.Users.FirstOrDefault(u => u.Username == model.Username);
            if (existingUser != null)
                return Conflict(new { message = "Username already exists." });

            var newUser = new User
            {
                Username = model.Username,
                Password = _encryption.Encrypt(model.Password),
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber,
                IsAdmin = false
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();

            return Ok(new { message = "Registration successful" });
        }
    }
}
