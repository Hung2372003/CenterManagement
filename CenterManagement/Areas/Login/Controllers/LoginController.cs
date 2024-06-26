using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Login.Controllers
{

    [Area("Login")]
    [Route("Login")]
   
    public class LoginController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
