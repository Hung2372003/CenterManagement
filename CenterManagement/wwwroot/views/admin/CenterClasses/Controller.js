var ctxfolder = "/views/admin/CenterClasses";
var ctxfolderMessage = "/views/message-box";
var app = angular.module("App_ESEIM", ["ngRoute", "ngResource", "ui.bootstrap", "datatables"]);

//var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'ui.tinymce', 'dynamicNumber', 'ngTagsInput']);

app.controller("Ctrl_ESEIM", function ($scope, $rootScope) {

    $rootScope.lock_screen = false;
    $rootScope.studentData = [
        { id: 1, subject: 'tiếng anh', year: '2024', grade: "3.1", maxStudents: 70, registerStudent: 30, tuition:20000000, statusClasses: "Mở đăng ký" },
        { id: 2, subject: 'tiếng anh', year: '2024', grade: "3.1", maxStudents: 70, registerStudent: 30, tuition: 70000000, statusClasses: "Đóng đăng ký" },
        { id: 3, subject: 'tiếng anh', year: '2024', grade: "3.1", maxStudents: 70, registerStudent: 30, tuition: 90000000, statusClasses: "Lớp học kết thúc" }
    ]




    $rootScope.gradeData = [
        { id: 1, teacherId: 'Nguyễn Văn Hưng', topic: '2024', grade: "3.1", startDate: "23/7/2024", startTime:"7h00",endTime:"10h30" },
        { id: 2, teacherId: 'Vữ Công Hậu', topic: '2024', grade: "3.1", startDate: "28/7/2024", startTime: "7h00", endTime: "10h30" },
        { id: 3, teacherId: 'Đăng Minh Phương', topic: '2024', grade: "3.1", startDate: "31/7/2024", startTime: "7h00", endTime: "10h30" }
    ]

});

app.factory('dataservice', function ($http, $window) {
    $http.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    var headers = {
        "Content-Type": "application/json;odata=verbose",
        "Accept": "application/json;odata=verbose",
    }
    var submitFormUpload = function (url, data, callback) {
        var req = {
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': undefined
            },
            beforeSend: function () {
                App.blockUI({
                    target: "#modal-body",
                    boxed: true,
                    message: 'loading...'
                });
            },
            complete: function () {
                App.unblockUI("#modal-body");
            },
            data: data
        }
        $http(req).success(callback);
    };
    return {
        addClasses: function (data, callback) {
            $http.post('http://localhost:3000/api/v1/class', data, {
                headers: {
                    'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {          
                callback(response.data);
            }, function (error) {
                toastr.error(error.data);
                console.error('Error:', error);
            });
        },
        addGrades: function (data, callback) {
            $http.post('http://localhost:3000/api/v1/class/add-lesson', data, {
                headers: {
                    'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                callback(response.data);
            }, function (error) {
                toastr.error(error.data);
                console.error('Error:', error);
            });
        },
        close: function (data, callback) {
            $http.post('http://localhost:3000/api/v1/class/set-status', data, {
                headers: {
                    'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                callback(response.data);
            }, function (error) {
                toastr.error(error.data);
                console.error('Error:', error);
            });
        },
        delete: function (data, callback) {
            $http.post('http://localhost:3000/api/v1/class/delete', data, {

                headers: {
                    'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                callback(response.data);
            }, function (error) {
                console.log($window.localStorage.getItem('token'))
                toastr.error(error.data);
                console.error('Error:', error);
            });
        },
    };
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
        .when("/detail", {
            templateUrl: ctxfolder + '/detail.html',
            controller: "detail"
        })

        .when("/addClasses", {
            templateUrl: ctxfolder + '/addClasses.html',
            controller: "addClasses"
        })
        .when("/addGrades", {
            templateUrl: ctxfolder + '/addGrades.html',
            controller: "addGrades"
        })
        .otherwise({
            redirectTo: "/"
        });

   


});

app.controller('index', function ($scope, $compile, $rootScope, $http, $uibModal, DTOptionsBuilder, DTColumnBuilder, dataservice, $window) {


    vm = $scope;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withDisplayLength(9)
        .withOption('order', [0, 'desc'])
        .withOption('autoWidth', false)
        .withOption('processing', true)
        .withOption('lengthChange', false)
        .withOption('searching', true)
        .withOption('scrollX', false)
        .withOption('pageLength', 10)
        .withOption('scrollCollapse', true)
        //tự điều chỉnh độ rộng của cột khớp màn hình
        .withLanguage({
            "info": "_END_ / _TOTAL_ mục",
            "paginate": {
                "first": '<<',
                "last": '>>',
                "next": 'tiếp',
                "previous": 'trước'
            },
            "lengthMenu": "Hiển thị _MENU_ mục",
            "search": "Tìm kiếm:",
            "infoEmpty": "Không có dữ liệu",
            "infoFiltered": "(lọc từ _MAX_ mục)",
            "zeroRecords": "Không tìm thấy dữ liệu"
        })

        /*.withOption('scrollX', false)*/
        /*  .withOption('serverSide', true)*/
        .withOption('columnDefs', [
            { targets: 0, visible: true },  // Ẩn cột đầu tiên          
        ])
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        });

    vm.dtColumns = [
        DTColumnBuilder.newColumn('_id').withTitle('Mã lớp').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('name').withTitle('Tên lớp').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('year').withTitle('Năm học').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('grade').withTitle('Lớp').renderWith(function (data, type) {
            return data;
        }),     
        DTColumnBuilder.newColumn('maxStudents').withTitle('Học viên tối đa').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('registerStudent').withTitle('Số lượng học viên').renderWith(function (data, type, full) {
           
            return full.students.length + "/" + full.maxStudents;
        }),
        DTColumnBuilder.newColumn('tuition').withTitle('Học phí lớp').renderWith(function (data, type) {
            return data +"đ";
        }),
        DTColumnBuilder.newColumn('status').withTitle('trạng thái').renderWith(function (data, type) {
            if (data == "open") {
                return `<span class="text-success">Mở đăng ký</span>`;
            } else if (data == "end") {
                return `<span  class="text-danger">Lớp học kết thúc</span>`;
            } else if (data == "close") {
                return `<span  class="text-warning">Đóng đăng ký</span>`;
            } else { return data; }
              
        }),
        DTColumnBuilder.newColumn(null).withTitle('Số buổi').renderWith(function (data, type, full) {
            return `<div style="display: flex;justify-content: space-between;align-items: center;"><span>` + full.lesson.length + `</span>` + '<button title="Các buổi học" ng-click="detail(' + "'" + full._id + "'" +')" style="width: 25px;pointer-events: auto !important; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgb(0 3 6 / 97%);border-radius: 50%;margin-right: 7px;color: white;background: #3d9afb;padding-top: 1px; " class="btn btn-icon-only btn-circle btn-outline-button-icon button-full "><i class="fa-solid fa-eye"></i></button></div>';
        }),

        DTColumnBuilder.newColumn('action').notSortable().withTitle('Thao tác').renderWith(function (data, type, full, meta) {
            if (full.status == "open") {            
                return '<button title="Đóng đăng ký" ng-click="lock(' + "'" + full._id + "'" +')"  style="width: 25px;pointer-events: auto !important; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgb(0 3 6 / 97%);border-radius: 50%;margin-right: 7px;color: white;background: #ff6000;padding-top: 1px; " class="btn btn-icon-only btn-circle btn-outline-button-icon button-full"><i class="fa-solid fa-key"></i></button>' +
                    '<button title="Xóa" ng-click="delete(' + "'" + full._id + "'" +')" style="width: 25px;pointer-events: auto !important; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgb(0 3 6 / 97%);border-radius: 50%;margin-right: 7px;color: white;background: #fe0000;padding-top: 1px; " class="btn btn-icon-only btn-circle btn-outline-button-icon button-full"><i class="fa fa-trash"></i></button>';
            }
            else if (full.status == "close") {             
                return '<button title="Mở đăng ký" ng-click="unlock(' + "'" + full._id + "'" +')" style="width: 25px;pointer-events: auto !important; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgb(0 3 6 / 97%);border-radius: 50%;margin-right: 7px;color: white;background: #47b35b;padding-top: 1px; " class="btn btn-icon-only btn-circle btn-outline-button-icon button-full"><i class="fa-solid fa-unlock-keyhole"></i></button>' +
                    '<button title="Xóa" ng-click="delete(' + "'" + full._id + "'" +')" style="width: 25px;pointer-events: auto !important; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgb(0 3 6 / 97%);border-radius: 50%;margin-right: 7px;color: white;background: #fe0000;padding-top: 1px; " class="btn btn-icon-only btn-circle btn-outline-button-icon button-full"><i class="fa fa-trash"></i></button>';
            }
            else
                return '<button title="Xóa" ng-click="delete(' + "'" + full._id + "'" +')" style="width: 25px;pointer-events: auto !important; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgb(0 3 6 / 97%);border-radius: 50%;margin-right: 7px;color: white;background: #fe0000;padding-top: 1px; " class="btn btn-icon-only btn-circle btn-outline-button-icon button-full"><i class="fa fa-trash"></i></button>';
            
        })
    ];

    vm.dtInstance = {};
/*    vm.dtOptions.data = $rootScope.studentData;*/

   

    $scope.response = {};

    loadData()

    function loadData() {


        $http.get('http://localhost:3000/api/v1/class', {
            headers: {
                'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            $scope.response = response.data;
            vm.dtOptions.data = $scope.response.metadata;
        })
            .catch(function (error) {
                console.error('Error:', error);
            });
    } 

    $scope.unlock = function (_id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmUpdate.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = "Xác nhận mở đăng ký lớp ?";
                $scope.ok = function () {
                    dataservice.close({ classId: _id, status: "open" }, function (rs) {
                        toastr.success(rs.message);
                        $uibModalInstance.dismiss('cancel');
                        loadData();
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '25',
        });
        modalInstance.result.then(function (d) {
            $scope.reloadNoResetPage();
        }, function () {
        });
    };

    $scope.lock = function (_id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmUpdate.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = "Xác nhận đóng đăng ký lớp ?";
                $scope.ok = function () {
                    dataservice.close({ classId: _id, status:"close" }, function (rs) {
                        toastr.success(rs.message);
                        $uibModalInstance.dismiss('cancel');
                        loadData();
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '25',
        
        });
        modalInstance.result.then(function (d) {
            $scope.reloadNoResetPage();
        }, function () {
        });
    };

    $scope.delete = function (_id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmDeleted.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = "Bạn có chắc chắn muốn xóa ?";
                $scope.ok = function () {
                    dataservice.delete({ classId: _id }, function (rs) {
                        toastr.success(rs.message);
                        loadData()
                        $uibModalInstance.dismiss('cancel');
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '25',
        });
        modalInstance.result.then(function (d) {
            loadData()
        
        }, function () {
        });
    };

    $scope.detail = function (_id) {
        console.log('Opening detail modal for student with id:', _id);
        $rootScope.lock_screen = !$rootScope.lock_screen;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/detail.html',
            controller: 'detail',
            backdrop: true,
            size: 'lg',
            resolve: {
                classesId: function () {
                    return _id;
                }
            }
        });
        modalInstance.opened.then(function () {
            $('.modal').css({
                'display': 'block',
                'visibility': 'visible',
                'opacity': '1',
                'top': '20vh',
                'max-width': '100%',
                'left': '7%',
            });
            $('.modal-content').css({
                'top': '23px !important'
            });
        });
        modalInstance.rendered.then(function () {
            var modalElement = angular.element(document.querySelector('.modal'));
            modalElement.addClass('modal-lg-detail');
        });

        modalInstance.result.then(function () {
            loadData()
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
            loadData()
        });


    };

    $scope.addClasses = function () {
        $rootScope.lock_screen = !$rootScope.lock_screen;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/addClasses.html',
            controller: 'addClasses',
            backdrop: 'static',
            size: 'lg',

        });
        modalInstance.opened.then(function () {

            $('.modal').addClass('fade in');
            $('.modal').css({
                'display': 'block',
                'visibility': 'visible',
                'opacity': '1',               
                'left': '7%',
                'max-width': '100%',
            });
            var modalContentElement = angular.element(document.querySelector('.modal-content'));
            modalContentElement.attr('style', 'top: 23px !important', 'position: relative');
        });


        modalInstance.rendered.then(function () {
            var modalElement = angular.element(document.querySelector('.modal'));
            modalElement.addClass('modal-lg');
        });

        //modalInstance.result.then(function () {
        //    $scope.reload();
        //}, function () {
        //    console.log('Modal dismissed at: ' + new Date());
        //});
    };

});

app.controller('detail', function ($scope, $uibModalInstance, $rootScope, $http, classesId, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, $window) {

    loadData();
    function loadData() {
        $http.get('http://localhost:3000/api/v1/class/lesson?classId=' + classesId, {
            headers: {
                'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            vm.dtOptions.data = response.data.metadata;
            console.log('Response:', $scope.response);
        })
            .catch(function (error) {
                toastr.success(error.data);
                console.error('Error:', error);
               /* $window.location.href = '/home/error';*/
            });
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
        $rootScope.lock_screen = !$rootScope.lock_screen;
    };


    vm = $scope;
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withDisplayLength(9)
        .withOption('autoWidth', false)
        .withOption('processing', true)
        .withOption('lengthChange', false)
        .withOption('searching', false)
        .withOption('scrollX', false)
        .withOption('pageLength', 10)

        .withOption('scrollCollapse', true)
        //tự điều chỉnh độ rộng của cột khớp màn hình
        .withLanguage({
            "info": "_END_ / _TOTAL_ mục",
            "paginate": {
                "first": '<<',
                "last": '>>',
                "next": 'tiếp',
                "previous": 'trước'
            },
            "lengthMenu": "Hiển thị _MENU_ mục",
            "search": "Tìm kiếm:",
            "infoEmpty": "Không có dữ liệu",
            "infoFiltered": "(lọc từ _MAX_ mục)",
            "zeroRecords": "Không tìm thấy dữ liệu"
        })

        /*.withOption('scrollX', false)*/
        /*  .withOption('serverSide', true)*/
        .withOption('columnDefs', [
            { targets: 0, visible: false },  // Ẩn cột đầu tiên          
        ])
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        });

    vm.dtColumns = [
        DTColumnBuilder.newColumn('_id').withTitle('id').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('teacher').withTitle('Giáo viên').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('topic').withTitle('Bài giảng').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('startDate').withTitle('Buổi học').renderWith(function (data, type,full) {
            return Tdate(full.startTime);
        }),
        DTColumnBuilder.newColumn('startTime').withTitle('Thời gian bắt đầu').renderWith(function (data, type) {
            return Ttime(data);
        }),
        DTColumnBuilder.newColumn('endTime').withTitle('Thời Gian kết thúc').renderWith(function (data, type) {
            return Ttime(data);
        }),
    ];
    vm.dtInstance = {};
    /* vm.dtOptions.data = $rootScope.gradeData;*/


    function Tdate(x) {

        var datePart = x.substring(0, 10);
        //var timePart = x.substring(11, 19);*/ // Lấy '09:19:00'
        //var year = parseInt(datePart.substring(0, 4), 10); 
        //var month = parseInt(datePart.substring(5, 7), 10); 
        //var day = parseInt(datePart.substring(8, 10), 10);     
        //var hours = parseInt(timePart.substring(0, 2), 10); 
        //var minutes = parseInt(timePart.substring(3, 5), 10); 
        //var seconds = parseInt(timePart.substring(6, 8), 10); 

        return datePart;
    }
    function Ttime(x) {
        var timePart = x.substring(11, 19); // Lấy '09:19:00'
        var hours = parseInt(timePart.substring(0, 2), 10);
        var minutes = parseInt(timePart.substring(3, 5), 10);
        var formattedHours = hours.toString().padStart(2, '0');
        var formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}h ${formattedMinutes}`;
    }

    $scope.classesId = classesId;

    $scope.addGrades = function () {

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/addGrades.html',
            controller: 'addGrades',
            backdrop: 'static',
            size: 'lg',
            resolve: {
                classId: function () {
                    return $scope.classesId;
                }
            }
        });
        modalInstance.opened.then(function () {
            $('.modal').css({
                'display': 'block',
                'visibility': 'visible',
                'opacity': '1',
                'left': '7%',
                'overflow': 'hidden',
                 'max-width': '100%',
            });
            $('.modal-content').css({
                'top': '23px !important'
            });
        });


        modalInstance.rendered.then(function () {
            var modalElement = angular.element(document.querySelector('.modal'));
            modalElement.addClass('modal-lg');
        });

        modalInstance.result.then(function () {
            loadData();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
        loadData();
    };



});

app.controller('addClasses', function ($scope, $uibModalInstance, $rootScope, $http,$compile, $uibModal, dataservice) {

    $scope.model = {   
        grade:0,
        name: '',
        year: 0,
        maxStudent: 0, 
        tuition: 0,
        
    }
    $scope.submit = function () {
        if (checkInput() == false) {
            $uibModalInstance.dismiss('cancel');
            return
        }
        dataservice.addClasses($scope.model, function (responseData) {
            toastr.success(responseData.message);
        });
        $uibModalInstance.close();

    }
    $scope.cancel = function () {
        $rootScope.lock_screen = !$rootScope.lock_screen;
        $uibModalInstance.dismiss('cancel');
    };

    $scope.change = checkInput;
    function checkInput() {

        if ($scope.model.name == null || $scope.model.name == '') {
            $scope.errorName= "* Yêu cầu nhập tên lớp !";
            $scope.tName = true;
        }
        else {
            $scope.tName = false
        }

        if ($scope.model.grade == null || $scope.model.grade == '') {
            $scope.errorGrade = "* Lớp không được để trống !";
            $scope.tGrade = true;
        }
        else if (!$scope.model.grade.match(/^[0-9]*$/)) {
            $scope.errorGrade = "* lớp chỉ có số !";
            $scope.tGrade = true;
        }
        else {
            $scope.tGrade = false
        }

        if ($scope.model.maxStudent == null || $scope.model.maxStudent == '') {
            $scope.errorMaxStudent = "* Số lượng học viên không đc để trống !";
            $scope.tMaxStudent = true;
        }
        else {
            $scope.tMaxStudent = false
        }

        if ($scope.model.year == null) {
            $scope.errorYear = "* yêu cầu nhập năm học !";
            $scope.tYear = true;
        }
        else {
            $scope.tYear = false
        }
        if ($scope.tName == false && $scope.tCardNumber == false && $scope.tGrade == false && $scope.tMaxStudent == false && $scope.tYear == false) { return true }
        else return false

    }

});

app.controller('addGrades', function ($scope, $uibModalInstance, classId,$rootScope, $compile, $uibModal,dataservice) {


    $scope.model = {
       
        topic: "",
        teacherId: "",
        startDate:"",
        startTime:"",
        endTime: "",
        classId: classId
    }

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.selectedDate = null;
    $scope.format = 'yyyy/MM/dd';
    $scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.startDate = {
        opened: false
    };
    $scope.openStartDate = function () {
        $scope.startDate.opened = true;
    };
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.showStartTime = false;
    $scope.showEndTime = false;
    $scope.selectedTime = "";
    $scope.selectedHour = "00h";
    $scope.selectedMinute = "00";
    $scope.hours = [];
    $scope.minutes = [];
    for (var i = 0; i < 24; i++) {
        var hour = (i < 10) ? "0" + i +"h" : "" + i + "h";
        $scope.hours.push(hour);
    }
    for (var j = 0; j < 60; j++) {
        var minute = (j < 10) ? "0" + j : "" + j;
        $scope.minutes.push(minute);
    }
    $scope.setEndTime = function () {
        $scope.model.endTime = $scope.selectedHour + ":" + $scope.selectedMinute;
        $scope.showEndTime = false;
    };
    $scope.setStartTime = function () {
        $scope.model.startTime = $scope.selectedHour + ":" + $scope.selectedMinute;
        $scope.showStartTime = false;
    };
    $scope.setCloseEndTime = function () {     
        $scope.showEndTime = false;      
    }
    $scope.setCloseStartTime = function () {
        $scope.showStartTime = false;
    }



    function SetDate(x, y) {
        var dateObject = new Date(x);
        var year = dateObject.getFullYear();
        var month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
        var day = ("0" + dateObject.getDate()).slice(-2); 
        var seconds = '00'; 
        var timeParts = y.split('h:')
        var hours = timeParts[0];
        var minutes = timeParts[1];
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;


    }

    $scope.submit = function () {
        $scope.model.startTime = SetDate($scope.model.startDate, $scope.model.startTime);
        $scope.model.endTime = SetDate($scope.model.startDate, $scope.model.endTime);

        dataservice.addGrades($scope.model, function (responseData) {
            toastr.success(responseData.message);
        });
        $uibModalInstance.close()

    }
  



});