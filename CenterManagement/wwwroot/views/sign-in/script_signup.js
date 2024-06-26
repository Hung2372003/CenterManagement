document.addEventListener("DOMContentLoaded", function() {
  // Lấy các phần tử cần thay đổi display
  const loginTabContent = document.getElementById("login-tab-content");
  const signupTabContent = document.getElementById("signup-tab-content");
  // Lấy phần tử <a> với class là tablinksignup và thêm event listener cho nó
  const linksignup = document.querySelector(".tablinksignup");
  const linksignin = document.querySelector(".tablinksignin");

  linksignup.addEventListener("click", function(event) {
      // Ngăn chặn hành vi mặc định của thẻ <a> (chẳng hạn nhảy đến URL khác)
      event.preventDefault();

      // Thay đổi thuộc tính display của các phần tử
      if (loginTabContent.style.display === "block") {
          loginTabContent.style.display = "none";
          signupTabContent.style.display = "block";
      } else {
          loginTabContent.style.display = "block";
          signupTabContent.style.display = "none";
      }
  });
  linksignin.addEventListener("click", function(event) {
    // Ngăn chặn hành vi mặc định của thẻ <a> (chẳng hạn nhảy đến URL khác)
    event.preventDefault();

    // Thay đổi thuộc tính display của các phần tử
    if (loginTabContent.style.display === "block") {
        loginTabContent.style.display = "none";
        signupTabContent.style.display = "block";
    } else {
        loginTabContent.style.display = "block";
        signupTabContent.style.display = "none";
    }
});
});
const btn_submit_signin = document.getElementById('btn_submit_signin');
const btn_submit_signup = document.getElementById('btn_submit_signup');

console.log(btn_submit_signin)
btn_submit_signin.onclick = login;
async function login(e) {
    e.preventDefault();
    const role = document.getElementById('role-user').value;
    const username = document.getElementById('user_login').value;
    const password = document.getElementById('user_pass').value;

    let apiUrl = ['http://localhost:3000/api/v1/auth/login/admin', 'http://localhost:3000/api/v1/auth/login/student', 'http://localhost:3000/api/v1/auth/login/teacher', 'http://localhost:3000/api/v1/auth/login/parent'];

    const requestBody = {
        username: username,
        password: password
    };

    try {
        let api;
        if (role === 'admin') {
            api = apiUrl[0];
        }
        if (role === 'student') {
            api = apiUrl[1];
        }
        if (role === 'teacher') {
            api = apiUrl[2];
        }
        if (role === 'parents') {
            api = apiUrl[3];
        }
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        if (response.ok) {
            const data = await response.json();
            // Xử lý dữ liệu trả về từ API, ví dụ như lưu token
            console.log('Login successful', data);
            // Lưu token vào localStorage nếu cần thiết
            localStorage.setItem('token', data.token);
            // Chuyển hướng đến trang chính
            window.location.href = '/CenterManagement/CenterManagement/Views/Shared/_Layout.cshtml';
        } else {
            console.error('Login failed', response.status);
            alert('Login failed: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    }
}
async function signup() {
   
    const role = document.getElementById('role-user').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('user_email').value;
    const username = document.getElementById('user_signup').value;
    const password = document.getElementById('user_pass_signup').value;

    let apiUrl = ['http://localhost:3000/api/v1/auth/signup/admin', 'http://localhost:3000/api/v1/auth/signup/student', 'http://localhost:3000/api/v1/auth/signup/teacher', 'http://localhost:3000/api/v1/auth/signup/parent    '];

    const requestBody = {
        name: name,
        username: username,
        password: password,
        email: email
    };

    try {
        let api;
        if (role === 'admin') {
          api = apiUrl[0];
        }
        if (role === 'student') {
            api = apiUrl[1];
        }
        if (role === 'teacher') {
            api = apiUrl[2];
        }
        if (role === 'parents') {
            api = apiUrl[3];
        }
        const response = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        if (response.ok) {
            const data = await response.json();
            alert("Sign up successful");
            // Lưu token vào localStorage nếu cần thiết
            localStorage.setItem('token', data.token);
            // Chuyển hướng đến trang chính
            window.location.href ='sign-up.html';
        } else {
            console.error('Signup failed', response.status);
            alert('Signup failed: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred: ' + error.message);
    }
}
document.getElementById('btn_submit_signup').addEventListener('click', function(event) {
    event.preventDefault(); 

    var password = document.getElementById('user_pass_signup').value;
    var confirmPassword = document.getElementById('user_pass_confirm').value;
    var errorMessage = document.getElementById('error-message'); 

    if (password === confirmPassword) {
        errorMessage.textContent = ''; 
        signup();
    } else {
        errorMessage.textContent = 'Mật khẩu không khớp. Vui lòng nhập lại.'; 
    }
});
