using Microsoft.AspNetCore.Mvc;

namespace CenterManagement.Areas.Student.Controllers
{
    [Area("Student")]
    [Route("RegisterClasses")]
    [Route("Student/RegisterClasses")]
    public class RegisterClassesController : Controller
    {
        [Route("")]
        [Route("index")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
