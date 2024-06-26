using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Lecturers.Controllers
{
    [Area("Lecturers")]
    [Route("ScheduleTeacher")]
    [Route("Lecturers/ScheduleTeacher")]
    public class ScheduleController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
