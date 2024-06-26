using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Student.Controllers
{
    [Area("Student")]
    [Route("Student")]
    [Route("Student/HomeStudent")]

    public class HomeStudentController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
