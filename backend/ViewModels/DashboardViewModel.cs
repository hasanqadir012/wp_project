using backend.Models;
using System.Collections.Generic;

namespace backend.ViewModels
{
    public class DashboardViewModel
    {
        public decimal TotalSales { get; set; }
        public List<Order> RecentOrders { get; set; }
        public List<PopularProduct> PopularProducts { get; set; }
        
        public int NewCustomersThisMonth { get; set; }
        public int LowStockItems { get; set; }
        public decimal MonthlyRevenue { get; set; }
    }

    public class PopularProduct
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int TotalSold { get; set; }
        public string ImageUrl { get; set; }
    }
}