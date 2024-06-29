
var ctxfolder = "/views/sign-in";

var app = angular.module("App_ESEIM", ["ngRoute", "ngResource", "ui.bootstrap", "datatables"]);


app.controller("Ctrl_ESEIM", function ($scope, $rootScope) {

   


});

app.config(function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
});





app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: ctxfolder + '/index.html',
            controller: "index"
        })
        .otherwise({
            redirectTo: "/"
        });



});


app.factory('authInterceptor', function ($q, $window) {
    return {
        request: function (config) {
            const token = $window.localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        },
        responseError: function (response) {
            if (response.status === 401) {
                // Xử lý khi token hết hạn hoặc không hợp lệ
            }
            return $q.reject(response);
        }
    };
});

app.controller('index', function ($scope, $http, $window, $location) {
   
    $scope.user = {};
    $scope.login = function () {
      
        

        $http.post('http://localhost:3000/api/v1/auth/login/' + $scope.user.role, $scope.user)               
                .then(function (response) {
                    // Lưu token vào localStorage
                    $window.localStorage.setItem('token', response.data.metadata.accessToken);
                    if (response.data.metadata.user.role == "admin") {
                        $window.location.href = '/Admin';
                    } else if (response.data.metadata.user.role == "parent") {
                        $window.location.href = '/HomeParents';
                    } else if (response.data.metadata.user.role == "teacher") {
                        $window.location.href = '/Lecturers';
                    } else {
                        $window.location.href = '/Student';
                    }
                    toastr.success(response.data.message);
                })
                .catch(function (error) {
                    toastr.error("Tài khoản hoặc mật khẩu không chính xác")
                });

       
    };

    $scope.isVisible = false;
    $scope.isVisible1 = true;
    //$scope.toggleVisibility = function () {
       
    //};

    $scope.openSign = function () {
        $scope.isVisible = !$scope.isVisible;
        $scope.isVisible1 = !$scope.isVisible1;
    }

    $scope.sign = {};
    $scope.sign_up = function () {
        $http.post('http://localhost:3000/api/v1/auth/signup/' + $scope.sign.role, $scope.sign)
            .then(function (response) {
                toastr.success(response.data.message);
       
            })
            .catch(function (error) {
            
            });
    };


});
