using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("ListStudents")]
    [Route("Admin/ListStudents")]
    public class ListStudentsController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
