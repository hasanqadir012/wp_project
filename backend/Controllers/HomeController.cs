using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.ViewModels;
using System.Diagnostics;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly DataLayers _context;

        public HomeController(DataLayers context)
        {
            _context = context;
        }

        [HttpGet("index")]
        public async Task<IActionResult> GetHomeData()
        {
            var featuredProducts = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.IsFeatured)
                .Take(8)
                .ToListAsync();

            var newArrivals = await _context.Products
                .OrderByDescending(p => p.CreatedAt)
                .Take(4)
                .ToListAsync();

            var categories = await _context.Categories.ToListAsync();

            var viewModel = new HomeViewModel
            {
                FeaturedProducts = featuredProducts,
                NewArrivals = newArrivals,
                Categories = categories
            };

            return Ok(viewModel);
        }

        [HttpGet("about")]
        public IActionResult GetAbout()
        {
            return Ok(new { Page = "About", Message = "This is the About page." });
        }

        [HttpGet("contact")]
        public IActionResult GetContact()
        {
            return Ok(new { Page = "Contact", Message = "This is the Contact page." });
        }

        [HttpGet("error")]
        public IActionResult GetError()
        {
            return Problem(detail: "An error occurred.", statusCode: 500);
        }
    }
}
