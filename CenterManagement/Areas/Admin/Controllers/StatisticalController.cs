using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("Statistical")]
    [Route("Admin/Statistical")]
    public class StatisticalController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
