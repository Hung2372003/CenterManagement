using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("ListTeacher")]
    [Route("Admin/ListTeacher")]
    public class CenterTeacherController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
