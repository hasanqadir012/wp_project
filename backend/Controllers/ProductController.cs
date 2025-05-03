using Microsoft.AspNetCore.Mvc;
using MyWebsite.Data;
using MyWebsite.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;
using System;
using MyWebsite.ViewModels;

namespace MyWebsite.Controllers
{
    public class ProductController : Controller
    {
        private readonly DataLayers _context;

        public ProductController(DataLayers context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var viewModel = new ProductCategoryViewModel
            {
                Products = _context.Products.Include(p => p.Category).ToList(),
                Categories = _context.Categories.ToList()
            };

            return View(viewModel);
        }

        public IActionResult PopularProducts()
        {
            var products = _context.Products
                .OrderByDescending(p => p.SoldQuantity)
                .Take(5)
                .ToList();

            return View(products);
        }

        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.Categories = _context.Categories.ToList();
            return View();
        }

        public ActionResult SearchPerfume(string searchTerm)
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

            return View("CategoryProducts", viewModel);
        }

        public ActionResult DisplayPerfumeCategory(string category)
        {
            IQueryable<Product> productQuery = _context.Products.Include(p => p.Category);

            switch (category.ToLower())
            {
                case "all collections":
                    // Do not filter
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

            return View("CategoryProducts", viewModel);
        }

        private List<string> GetCategoryList()
        {
            return new List<string>
            {
                "All Collections",
                "Men",
                "Women",
                "Unisex",
                "Best Selling",
                "New Arrivals"
            };
        }
    }
}
