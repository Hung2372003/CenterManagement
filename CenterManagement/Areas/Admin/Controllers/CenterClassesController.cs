using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("CenterClasses")]
    [Route("Admin/CenterClasses")]
    public class CenterClassesController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
