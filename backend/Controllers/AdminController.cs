using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MyWebsite.Data;
using MyWebsite.Models;
using MyWebsite.ViewModels;


namespace MyWebsite.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private readonly DataLayers _db;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public AdminController(DataLayers db, IWebHostEnvironment hostingEnvironment)
        {
            _db = db;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<IActionResult> Products()
        {
            var products = await _db.Products
                .Include(p => p.Category)
                .Include(p => p.ImageUrl) 
                .ToListAsync();
            return View(products);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreateProduct(ProductViewModel model)
        {
            if (ModelState.IsValid)
            {
                var product = new Product
                {
                    Name = model.Name,
                    Description = model.Description,
                    Price = model.Price,
                    CategoryId = model.CategoryId,
                    StockQuantity = model.StockQuantity,
                    IsAvailable = model.IsAvailable,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                _db.Products.Add(product);
                await _db.SaveChangesAsync();

                await UploadProductImages(model.Images, product.Id);
                return RedirectToAction(nameof(Products));
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateProduct(int id, ProductUpdateViewModel model)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (ModelState.IsValid)
            {
                product.Name = model.Name;
                product.Description = model.Description;
                product.Price = model.Price;
                product.CategoryId = model.CategoryId;
                product.StockQuantity = model.StockQuantity;
                product.IsAvailable = model.IsAvailable;
                product.UpdatedAt = DateTime.Now;

                await _db.SaveChangesAsync();
                return RedirectToAction(nameof(Products));
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);

            if (product != null)
            {
                DeleteImageFromStorage(product.ImageUrl);

                _db.Products.Remove(product);
                await _db.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Products));
        }


        public async Task<IActionResult> Orders()
        {
            var orders = await _db.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return View(orders);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, string newStatus)
        {
            var order = await _db.Orders.FindAsync(orderId);
            if (order != null && Enum.TryParse<OrderStatus>(newStatus, true, out var status))
            {
                order.OrderStatus = status;
                order.updatedAt = DateTime.Now;
                await _db.SaveChangesAsync();
            }

            return RedirectToAction(nameof(Orders));
        }


        public async Task<IActionResult> InventoryReport()
        {
            var lowStock = await _db.Products
                .Where(p => p.StockQuantity < 10)
                .ToListAsync();

            return View(lowStock);
        }

        public async Task<IActionResult> Dashboard()
        {
            var vm = new DashboardViewModel
            {
                TotalSales = await _db.Orders.SumAsync(o => o.TotalAmount),
                RecentOrders = await _db.Orders
                    .OrderByDescending(o => o.CreatedAt)
                    .Take(10)
                    .ToListAsync(),
                PopularProducts = await _db.OrderItems
                    .GroupBy(oi => oi.ProductId)
                    .Select(g => new PopularProduct
                    {
                        ProductId = g.Key,
                        TotalSold = g.Sum(oi => oi.Quantity)
                    })
                    .OrderByDescending(pp => pp.TotalSold)
                    .Take(5)
                    .ToListAsync()
            };

            return View(vm);
        }

        private async Task UploadProductImages(IEnumerable<IFormFile> files, int productId)
        {
            foreach (var file in files)
            {
                if (file != null && file.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "Content/ProductImages");
                    Directory.CreateDirectory(uploadsFolder);

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(fileStream);
                    }

                }
            }

            await _db.SaveChangesAsync();
        }

        private void DeleteImageFromStorage(string imageUrl)
        {
            var imagePath = Path.Combine(_hostingEnvironment.WebRootPath, imageUrl.TrimStart('/'));
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }
    }
}
