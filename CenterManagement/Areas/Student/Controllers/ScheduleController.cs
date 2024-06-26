using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Student.Controllers
{

    [Area("Student")]
    [Route("Schedule")]
    [Route("Student/Schedule")]
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
