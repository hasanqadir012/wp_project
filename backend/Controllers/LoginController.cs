using Microsoft.AspNetCore.Mvc;
using backend.Models;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;
using backend.Data;
using backend.Services;
using backend.ViewModels;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly DataLayers _context;
        private readonly IEncryption _encryption;

        public LoginController(DataLayers context, IEncryption encryption)
        {
            _context = context;
            _encryption = encryption;
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
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User"),
                    new Claim("UserId", user.Id.ToString())
                };

                var identity = new ClaimsIdentity(claims, IdentityConstants.ApplicationScheme);
                var principal = new ClaimsPrincipal(identity);

                var authProperties = new AuthenticationProperties
                {
                    IsPersistent = model.RememberMe,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddHours(3)
                };

                await HttpContext.SignInAsync(
                    IdentityConstants.ApplicationScheme,
                    principal,
                    authProperties
                );

                return Ok(new { message = "Login successful", user = user.Username, isAdmin = user.IsAdmin });
            }

            return Unauthorized(new { message = "Invalid login attempt." });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            return Ok(new { message = "Logged out successfully" });
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
