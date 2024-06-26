using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Lecturers.Controllers
{
    [Area("Lecturers")]
    [Route("Attendance")]
    [Route("Lecturers/Attendance")]
    public class AttendanceController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
