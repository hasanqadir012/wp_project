using Microsoft.AspNetCore.Mvc;
using MyWebsite.Data;
using MyWebsite.Models;
using Microsoft.EntityFrameworkCore;
using MyWebsite.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MyWebsite.Controllers
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
                Products = _context.Products.Include(p => p.Category).ToList(),
                Categories = _context.Categories.ToList()
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

        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories);
        }

        [HttpGet("search")]
        public IActionResult SearchPerfume([FromQuery] string searchTerm)
        {
            var products = _context.Products
                .Include(p => p.Category)
                .Where(p => p.Name.Contains(searchTerm))
                .ToList();

            var viewModel = new ProductCategoryViewModel
            {
                Products = products,
                Categories = _context.Categories.ToList(),
                SelectedCategory = "Search Results"
            };

            return Ok(viewModel);
        }

        [HttpGet("category")]
        public IActionResult DisplayPerfumeCategory([FromQuery] string category)
        {
            IQueryable<Product> productQuery = _context.Products.Include(p => p.Category);

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
                Products = productQuery.ToList(),
                Categories = _context.Categories.ToList(),
                SelectedCategory = category
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
