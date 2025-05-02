using labs.Models;
using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using labs.Dal;
using labs.ModelView;
using labs.Classes;

namespace labs.Controllers
{
    public class LoginController : Controller
    {
        private readonly DataLayers _db = new DataLayers();
        private readonly Encryption _encryption = new Encryption();

        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Authenticate(UserLoginViewModel model, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View("Login", model);
            }

            var user = _db.Users.FirstOrDefault(u => u.UserName == model.UserName);
            if (user == null)
            {
                ModelState.AddModelError("", "Invalid username or password");
                return View("Login", model);
            }

            if (!_encryption.ValidatePassword(model.Password, user.Password))
            {
                ModelState.AddModelError("", "Invalid username or password");
                return View("Login", model);
            }

            FormsAuthentication.SetAuthCookie(user.UserName, model.RememberMe);

            Session["UserId"] = user.UserId;
            Session["UserName"] = user.UserName;
            
            if (user.Admin) 
            {
                Session["Admin"] = true;
                return RedirectToAction("Index", "Admin");
            }

            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        [Authorize]
        public ActionResult LogOff()
        {
            FormsAuthentication.SignOut();
            Session.Clear();
            return RedirectToAction("Index", "Home");
        }

        [AllowAnonymous]
        public ActionResult Register()
        {
            return View(new UserRegisterViewModel());
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public ActionResult Submit(UserRegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View("Register", model);
            }

            if (_db.Users.Any(u => u.UserName == model.UserName))
            {
                ModelState.AddModelError("UserName", "Username already exists");
                return View("Register", model);
            }

            try
            {
                var newUser = new User
                {
                    UserName = model.UserName,
                    Password = _encryption.CreateHash(model.Password),
                    Email = model.Email,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    PhoneNumber = model.PhoneNumber,
                    Admin = false, 
                    CreatedAt = DateTime.Now
                };

                _db.Users.Add(newUser);
                _db.SaveChanges();

                FormsAuthentication.SetAuthCookie(newUser.UserName, false);
                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "An error occurred during registration. Please try again.");
                return View("Register", model);
            }
        }
    }
}