using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Parents.Cotrollers
{
    [Area("Parents")]
    [Route("HomeParents")]
    [Route("Parents/HomeParents")]
    public class HomeParentsController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
