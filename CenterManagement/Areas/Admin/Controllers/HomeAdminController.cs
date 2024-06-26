using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("Admin")]
    [Route("Admin/HomeAdmin")]
    public class HomeAdminController : Controller
    {
        [Route("")]
        [Route("index")]
       
        public IActionResult Index()
        {
            return View();
        }
    }
}
