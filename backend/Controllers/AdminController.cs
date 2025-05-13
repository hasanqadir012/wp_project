using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.ViewModels;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly DataLayers _db;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public AdminController(DataLayers db, IWebHostEnvironment hostingEnvironment)
        {
            _db = db;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _db.Products
                .Include(p => p.Category)
                .ToListAsync();
            return Ok(products);
        }

        [HttpPost("products")]
        public async Task<IActionResult> CreateProduct([FromForm] ProductViewModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var product = new Product
            {
                Name = model.Name,
                Description = model.Description,
                Price = model.Price,
                CategoryId = _db.Categories
                    .Where(c => c.Name.ToLower() == model.CategoryName.ToLower())
                    .ToList()[0]
                    .CategoryId,
                StockQuantity = model.StockQuantity,
                IsAvailable = model.IsAvailable,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            if (model.Images != null && model.Images.Count > 0)
            {
                // Get the primary image (first image) to set as product's main image
                var mainImagePath = await UploadProductImage(model.Images[0], product.Id);
                Console.WriteLine(mainImagePath + " ....helooooooooooooooooooooooooooooooooooooooo");
                if (!string.IsNullOrEmpty(mainImagePath))
                {
                    product.ImageUrl = mainImagePath;
                    await _db.SaveChangesAsync();
                }

                // Upload and save additional images
                if (model.Images.Count > 1)
                {
                    var productImages = new List<ProductImage>();
                    for (int i = 1; i < model.Images.Count; i++)
                    {
                        var imagePath = await UploadProductImage(model.Images[i], product.Id);
                        Console.WriteLine(imagePath, " ....worlddddddddddddddddddddddddd");
                        if (!string.IsNullOrEmpty(imagePath))
                        {
                            productImages.Add(new ProductImage
                            {
                                ProductId = product.Id,
                                ImageUrl = imagePath,
                                CreatedAt = DateTime.Now
                            });
                        }
                    }

                    if (productImages.Any())
                    {
                        await _db.ProductImages.AddRangeAsync(productImages);
                        await _db.SaveChangesAsync();
                    }
                }
            }

            return Ok(new { message = "Product Added"});
        }

        [HttpPut("products/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateViewModel model)
        {
            var product = await _db.Products.FindAsync(id);
            if (product == null) return NotFound();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.CategoryId = _db.Categories
                .Where(c => c.Name.ToLower() == model.CategoryName.ToLower())
                .ToList()[0]
                .CategoryId;
            product.StockQuantity = model.StockQuantity;
            product.IsAvailable = model.IsAvailable;
            product.UpdatedAt = DateTime.Now;

            if (model.Images != null && model.Images.Count > 0)
            {
                // Update main image
                var mainImagePath = await UploadProductImage(model.Images[0], product.Id);
                if (!string.IsNullOrEmpty(mainImagePath))
                {
                    // Delete old image if exists
                    if (!string.IsNullOrEmpty(product.ImageUrl))
                    {
                        DeleteImageFromStorage(product.ImageUrl);
                    }

                    product.ImageUrl = mainImagePath;
                }
            }

            await _db.SaveChangesAsync();

            return Ok(product);
        }

        [HttpDelete("products/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _db.Products.FirstOrDefaultAsync(p => p.Id == id);
            if (product == null) return NotFound();

            if(product.ImageUrl != null)
                DeleteImageFromStorage(product.ImageUrl);

            var productImages = await _db.ProductImages.Where(pi => pi.ProductId == id).ToListAsync();
            foreach (var image in productImages)
            {
                DeleteImageFromStorage(image.ImageUrl);
            }
            _db.ProductImages.RemoveRange(productImages);
            _db.Products.Remove(product);

            await _db.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _db.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPut("orders/{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromQuery] string newStatus)
        {
            var order = await _db.Orders.FindAsync(orderId);
            if (order == null) return NotFound();

            if (Enum.TryParse<OrderStatus>(newStatus, true, out var status))
            {
                order.OrderStatus = status;
                order.updatedAt = DateTime.Now;
                await _db.SaveChangesAsync();
                return Ok(order);
            }

            return BadRequest("Invalid order status.");
        }

        [HttpGet("inventory-report")]
        public async Task<IActionResult> GetInventoryReport()
        {
            var lowStock = await _db.Products
                .Where(p => p.StockQuantity < 10)
                .Include(p => p.Category)
                .ToListAsync();

            return Ok(lowStock);
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard()
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

            return Ok(vm);
        }

        private async Task<string> UploadProductImage(IFormFile file, int productId)
        {
            if (file != null && file.Length > 0)
            {
                var uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "Content", "ProductImages", productId.ToString());
                Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                return $"/Content/ProductImages/{productId}/{uniqueFileName}";
            }
            return null;
        }

        private void DeleteImageFromStorage(string imageUrl)
        {
            if (string.IsNullOrEmpty(imageUrl)) return;

            var imagePath = Path.Combine(_hostingEnvironment.WebRootPath, imageUrl.TrimStart('/'));
            if (System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }
    }
}
