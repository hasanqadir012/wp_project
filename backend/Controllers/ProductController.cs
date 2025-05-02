using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using labs.Models;
using labs.ModelView;
using labs.Dal;

namespace labs.Controllers
{
    public class ProductController : Controller
    {
        private readonly DataLayers _dal = new DataLayers();

        public ActionResult ShowSearch()
        {
            ProductViewModel cvm = new ProductViewModel
            {
                Products = new List<Product>(),
                Categories = GetCategoryList() 
            };
            return View("SearchPerfume", cvm);
        }

        public ActionResult SearchPerfume(string searchTerm)
        {
            var products = _dal.Products
                .Where(p => p.Name.Contains(searchTerm))
                .ToList();

            var cvm = new ProductViewModel
            {
                Products = products,
                Categories = GetCategoryList()
            };

            return View(cvm);
        }

        public ActionResult DisplayPerfumeCategory(string category)
        {
            IQueryable<Product> productQuery = _dal.Products;

            switch (category.ToLower())
            {
                case "all collections":
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

            var cvm = new ProductViewModel
            {
                Products = productQuery.ToList(),
                Categories = GetCategoryList(),
                SelectedCategory = category
            };

            return View("CategoryProducts", cvm);
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