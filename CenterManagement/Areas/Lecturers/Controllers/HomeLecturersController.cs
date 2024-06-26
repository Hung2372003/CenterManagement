using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Lecturers.Controllers
{
    [Area("Lecturers")]
    [Route("Lecturers")]
    [Route("Lecturers/HomeLecturers")]

    public class HomeLecturersController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
