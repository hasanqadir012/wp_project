using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using backend.ViewModels;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly DataLayers _context;

        public ProductController(DataLayers context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var viewModel = new ProductCategoryViewModel
            {
                Products = [.. _context.Products.Include(p => p.Category)],
            };

            return Ok(viewModel);
        }

        [HttpGet("popular")]
        public IActionResult GetPopularProducts()
        {
            var products = _context.Products
                .OrderByDescending(p => p.SoldQuantity)
                .Take(5)
                .ToList();

            return Ok(products);
        }

        [HttpGet("search")]
        public IActionResult SearchPerfume(
            [FromQuery] string searchTerm = "",
            [FromQuery] string category = "all collections",
            [FromQuery] decimal priceLow = 0,
            [FromQuery] decimal priceHigh = 10000)
        {
            var productQuery = _context.Products
                .Include(p => p.Category)
                .Where(p => p.Name.Contains(searchTerm))
                .Where(p => p.Price > priceLow)
                .Where(p => p.Price < priceHigh);

            switch (category.ToLower())
            {
                case "all collections":
                    // no filter
                    break;

                case "best selling":
                    productQuery = productQuery
                        .OrderByDescending(p => p.SoldQuantity)
                        .Take(20);
                    break;

                case "new arrivals":
                    productQuery = productQuery
                        .Where(p => p.CreatedAt >= DateTime.Now.AddMonths(-1))
                        .OrderByDescending(p => p.CreatedAt);
                    break;

                default:
                    productQuery = productQuery
                        .Where(p => p.Category.Name.ToLower() == category.ToLower());
                    break;
            }

            var viewModel = new ProductCategoryViewModel
            {
                Products = [.. productQuery],
            };

            return Ok(viewModel);
        }

        [HttpGet("category-list")]
        public IActionResult GetCategoryList()
        {
            var list = new List<string>
            {
                "All Collections",
                "Men",
                "Women",
                "Unisex",
                "Best Selling",
                "New Arrivals"
            };

            return Ok(list);
        }
    }
}
