using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using backend.ViewModels;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CheckoutController : ControllerBase
    {
        private readonly DataLayers _context;

        public CheckoutController(DataLayers context)
        {
            _context = context;
        }

        [HttpPost("place-order")]
        public async Task<IActionResult> PlaceOrder([FromBody] CheckoutViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Get the current user ID from the token
            var userId = int.Parse(User.FindFirstValue("UserId"));
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return Unauthorized("User not found");
            }

            // Create a new order
            var order = new Order
            {
                UserId = userId,
                OrderDate = DateTime.Now,
                TotalAmount = model.TotalAmount,
                OrderStatus = OrderStatus.Pending,
                ShippingAddressId = model.ShippingAddress.Id,
                BillingAddressId = model.BillingAddress.Id,
                PaymentMethod = "Cash on Delivery",
                TransactionId = GenerateTransactionId(),
                CreatedAt = DateTime.Now,
                updatedAt = DateTime.Now
            };

            // Add order to database
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            // Create order items from the cart items
            foreach (var item in model.CartItems)
            {
                var product = await _context.Products.FindAsync(item.ProductId);

                if (product == null)
                {
                    continue; // Skip invalid products
                }

                // Create order item
                var orderItem = new OrderItem
                {
                    OrderId = order.OrderId,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = (int)product.Price
                };

                // Reduce stock quantity
                product.StockQuantity -= item.Quantity;
                product.SoldQuantity += item.Quantity;

                // Add order item to database
                await _context.OrderItems.AddAsync(orderItem);
            }

            // Save changes
            await _context.SaveChangesAsync();

            // Return order details
            return Ok(new
            {
                OrderId = order.OrderId,
                Message = "Order placed successfully"
            });
        }

        private string GenerateTransactionId()
        {
            // Generate a unique transaction ID
            return $"TXN-{DateTime.Now:yyyyMMddHHmmss}-{Guid.NewGuid().ToString().Substring(0, 8)}";
        }
    }
}