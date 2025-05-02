using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using labs.Models;
using labs.ModelView;
using labs.Dal;
using System.Threading;


namespace labs.Controllers
{

    [Authorize(Roles = "Admin")]
public class AdminController : Controller
{
    private readonly ApplicationDbContext _db = new ApplicationDbContext();

    public async Task<ActionResult> Products()
    {
        var products = await _db.Products
            .Include(p => p.Category)
            .Include(p => p.ProductImages)
            .ToListAsync();
        return View(products);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> CreateProduct(ProductViewModel model)
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
                SKU = GenerateSKU(model),
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            _db.Products.Add(product);
            await _db.SaveChangesAsync();
            
            await UploadProductImages(model.Images, product.ProductId);
            
            return RedirectToAction("Products");
        }
        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> UpdateProduct(int id, ProductUpdateViewModel model)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return HttpNotFound();

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
            return RedirectToAction("Products");
        }
        return View(model);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await _db.Products
            .Include(p => p.ProductImages)
            .FirstOrDefaultAsync(p => p.ProductId == id);

        if (product != null)
        {
            foreach (var image in product.ProductImages)
            {
                DeleteImageFromStorage(image.ImageUrl);
            }
            
            _db.Products.Remove(product);
            await _db.SaveChangesAsync();
        }
        return RedirectToAction("Products");
    }

    public async Task<ActionResult> Orders()
    {
        var orders = await _db.Orders
            .Include(o => o.OrderItems)
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        return View(orders);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<ActionResult> UpdateOrderStatus(int orderId, OrderStatus status)
    {
        var order = await _db.Orders.FindAsync(orderId);
        if (order != null)
        {
            order.OrderStatus = status;
            order.UpdatedAt = DateTime.Now;
            await _db.SaveChangesAsync();
        }
        return RedirectToAction("Orders");
    }



    private async Task UploadProductImages(IEnumerable<HttpPostedFileBase> files, int productId)
    {
        foreach (var file in files)
        {
            if (file != null && file.ContentLength > 0)
            {
                var fileName = Path.GetFileName(file.FileName);
                var path = Path.Combine(Server.MapPath("~/Content/ProductImages"), fileName);
                file.SaveAs(path);

                _db.ProductImages.Add(new ProductImage
                {
                    ProductId = productId,
                    ImageUrl = "/Content/ProductImages/" + fileName,
                    IsDefault = false
                });
            }
        }
        await _db.SaveChangesAsync();
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing)
        {
            _db.Dispose();
        }
        base.Dispose(disposing);
    }

public async Task<ActionResult> InventoryReport()
{
    var lowStock = await _db.Products
        .Where(p => p.StockQuantity < 10)
        .ToListAsync();
    return View(lowStock);
}

public async Task<ActionResult> Dashboard()
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



        public ActionResult Index()
        {
            return View();
        }
    }
}
