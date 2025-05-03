using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MyWebsite.Models;
using MyWebsite.Data;
using Microsoft.EntityFrameworkCore;
using MyWebsite.ViewModels;

namespace MyWebsite.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly DataLayers _context;

        public HomeController(
            ILogger<HomeController> logger,
            DataLayers context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<IActionResult> Index()
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

            var viewModel = new HomeViewModel
            {
                FeaturedProducts = featuredProducts,
                NewArrivals = newArrivals,
                Categories = await _context.Categories.ToListAsync()
            };

            return View(viewModel);
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        public async Task<IActionResult> Shop(string category = null, int page = 1)
        {
            const int pageSize = 12;
            
            IQueryable<Product> products = _context.Products
                .Include(p => p.Category);

            if (!string.IsNullOrEmpty(category))
            {
                products = products.Where(p => p.Category.Name == category);
            }

            var paginatedProducts = await products
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var viewModel = new ShopViewModel
            {
                Products = paginatedProducts,
                CurrentCategory = category,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(products.Count() / (double)pageSize),
                Categories = await _context.Categories.ToListAsync()
            };

            return View(viewModel);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel 
            { 
                RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier 
            });
        }
    }
}