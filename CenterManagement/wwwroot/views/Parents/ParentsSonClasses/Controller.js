var ctxfolder = "/views/Parents/ParentsSonClasses";
var ctxfolderMessage = "/views/message-box";
var app = angular.module("App_ESEIM", ["ngRoute", "ngResource", "ui.bootstrap", "datatables"]);


//var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'ui.tinymce', 'dynamicNumber', 'ngTagsInput']);

app.controller("Ctrl_ESEIM", function ($scope,$rootScope) {

   
    $rootScope.gradeData = [
        { id: 1, teacherId: 'Nguyễn Văn Hưng', topic: '2024', grade: "3.1", startDate: "23/7/2024", startTime: "7h00", endTime: "10h30" },
        { id: 2, teacherId: 'Vữ Công Hậu', topic: '2024', grade: "3.1", startDate: "28/7/2024", startTime: "7h00", endTime: "10h30" },
        { id: 3, teacherId: 'Đăng Minh Phương', topic: '2024', grade: "3.1", startDate: "31/7/2024", startTime: "7h00", endTime: "10h30" }
    ]


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
        pay: function (data, callback) {
            $http.post('http://localhost:3000/api/v1/payment/pay-tuition', data, {
                headers: {
                    'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                callback(response.data);
            }, function (error) {
                console.error('Error:', error);
            });
        },

    };
});


app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: ctxfolder + '/index.html',
            controller: "index"
        })
        .when('/detail', {
            templateUrl: ctxfolder + '/detail.html',
            controller: 'detail'
        })
        .when('/pay', {
            templateUrl: ctxfolder + '/pay.html',
            controller: 'pay'
        })
        //.otherwise({
        //    redirectTo: "/"
        //});



});




app.controller('index', function ($scope, $compile, $rootScope, $http, $uibModal, DTOptionsBuilder, DTColumnBuilder, $window) {

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
        DTColumnBuilder.newColumn('_id').withTitle('ID').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('name').withTitle('Tên Lớp').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('year').withTitle('Năm học').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('grade').withTitle('Lớp').renderWith(function (data, type) {
            return data;
        }),
        //DTColumnBuilder.newColumn('teacher').withTitle('Giảng viên chính').renderWith(function (data, type) {
        //    return data;
        //}),
        DTColumnBuilder.newColumn('totalLesson').withTitle('Tổng số buổi học').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('learned').withTitle('Đã học').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('skipClass').withTitle('Đã nghỉ').renderWith(function (data, type,full) {
            return  `<div style="display: flex;justify-content: space-between;align-items: center;"><span  class="text-danger">` + data + `</span>` + '<button title="Các buổi học" ng-click="detail(' +"'"+ full._id +"'"+ ')" style="width: 25px;pointer-events: auto !important; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgb(0 3 6 / 97%);border-radius: 50%;margin-right: 7px;color: white;background: #3d9afb;padding-top: 1px; " class="btn btn-icon-only btn-circle btn-outline-button-icon"><i class="fa-solid fa-eye"></i></button></div>';
        }),
        DTColumnBuilder.newColumn('tuition').withTitle('Học phí').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('paid').withTitle('Còn phải đóng').renderWith(function (data, type,full) {
            if ((full.tuition - full.paid)>0) {
                return `<span  class="text-danger">` + (full.tuition - full.paid) +  `</span>`;
            } else return 0;
        }),
        DTColumnBuilder.newColumn('action').notSortable().withTitle('Thanh toán học phí').renderWith(function (data, type, full, meta) {
            if ((full.tuition - full.paid) > 0) {
                var tuitionUnpaid = (full.tuition - full.paid);
                return ' <button type="button"  ng-click="pay(\'' + full._id + '\', ' + tuitionUnpaid + ')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 17px; padding-right: 17px;background: #ff6300;align-items: center;display:flex;">Thanh toán</button > ';
            }
            else {
                return '';
            }
        }),

    ];

    vm.dtInstance = {};

    //vm.dtOptions.data = [
    //    { _id: 1, name: 'Listening', year: '2000', totalLesson: 15, learned: 2, grade: 'Grade 1', teacher:"Nguyễn Văn Hưng", skipClass: 1, tuition: 20000000, tuitionUnpaid :400000},
    //    { _id: 2, name: 'reading', year: '2000', totalLesson: 14, learned: 4, grade: 'Grade 2', teacher: "Nguyễn Văn Hưng", skipClass: 2, tuition: 20000000, tuitionUnpaid: 400000 } ,
    //    { _id: 3, name: 'wishtkjths', year: '2000', totalLesson: 17, learned: 7, grade: 'Grade 3', teacher: "Nguyễn Văn Hưng", skipClass: 2, tuition: 20000000, tuitionUnpaid: 400000 }
    //];

   
    $http.get('http://localhost:3000/api/v1/student/statusv2', {
        headers: {
            'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            $scope.dtOptions.data = response.data.metadata;
        })
        .catch(function (error) {
            $window.location.href = '/home/error';
        });
    function callback(json) {

    }

    $scope.detail = function (_id) {
        console.log('Opening detail modal for student with id:', _id);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/detail.html',
            controller: 'detail',
            backdrop: 'static',
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
            $scope.reload();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });

    };

    $scope.pay = function (_id, tuitionUnpaid) {
  
        console.log('Opening detail modal for student with id:', _id);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/pay.html',
            controller: 'pay',
            backdrop: 'static',
            size: 'lg',

            resolve: {
                classesId: function () {
                    return { _id: _id, tuitionUnpaid: tuitionUnpaid };
                }
            }
        });
        modalInstance.opened.then(function () {
            $('.modal').css({
                'display': 'block',
                'visibility': 'visible',
                'opacity': '1',
            /*    'top': '20vh',*/
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
            $scope.reload();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });

    };

});

app.controller('detail', function ($scope, $uibModalInstance, $rootScope, $http, classesId, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder,$window) {


   


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
        DTColumnBuilder.newColumn('startDate').withTitle('Buổi học').renderWith(function (data, type,full) {
            return `<span class="text-danger">` + setDate(full.startTime) + `</span>`;
        }),
        DTColumnBuilder.newColumn('startTime').withTitle('Thời gian bắt đầu').renderWith(function (data, type) {
            return setTime(data);
        }),
        DTColumnBuilder.newColumn('endTime').withTitle('Thời Gian kết thúc').renderWith(function (data, type) {
            return setTime(data);
        }),
        DTColumnBuilder.newColumn('teacher').withTitle('Giáo viên').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('topic').withTitle('Bài giảng').renderWith(function (data, type) {
            return data;
        }),
      
    ];

    vm.dtInstance = {};
/*    vm.dtOptions.data = $rootScope.gradeData;*/

    $http.get('http://localhost:3000/api/v1/class/absentlesson/student?classId=' + classesId, {
        headers: {
            'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            vm.dtOptions.data = response.data.metadata;
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
    function setTime(x) {
        var parts = x.split('T');
        $scope.date = parts[0];
        var timeParts = parts[1].split(':');
        //$scope.time = timeParts[0] + 'h:' + timeParts[1] + ':' + timeParts[2];
        return timeParts[0] + 'h' + timeParts[1];

    }
    function setDate(x) {
        var parts = x.split('T');
        $scope.date = parts[0];
        $scope.time = parts[1];
        return parts[0];
    }

});

app.controller('pay', function ($scope, $uibModalInstance, $rootScope, $http, classesId, $compile, $uibModal, dataservice) {

  /*  $scope.model.classesId = classesId;*/
    $scope.model = {
        classId: classesId._id,
        tuitionUnpaid: classesId.tuitionUnpaid.toString() + " VNĐ",
        money: classesId.tuitionUnpaid,
        ccv: '',
        cardNumber: '',
        nameOfCard:''

    }
    

    $scope.generateQRCode = function () {       
        //$scope.qr = "https://api.vietqr.io/image/970422-0388568575-k6b0GjK.jpg?accountName=NGUYEN%20VAN%20HUNG&amount=" + $scope.model.money + "&addInfo=hoc%20phi%20CenterEL";
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmUpdate.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance,model) {
                $scope.model = model;
                $scope.message = "bạn có muốn thưc hiện giao dịch này?";
             
                $scope.ok = function () {
                    if (checkInput() == false) {
                        $uibModalInstance.dismiss('cancel');
                        return
                    }
                    dataservice.pay($scope.model, function (responseData) {
                        toastr.success("thanh toán thành công");
                        $uibModalInstance.dismiss('cancel');
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '25',

            resolve: {
                model: function () {
                    return $scope.model; // Truyền model vào modal qua resolve
                }
            }
            
        });
        //modalInstance.result.then(function (d) {
        //    $scope.reloadNoResetPage();

        //})
    };
    var haveNumber = /\d/;
    var onlyNumber = /^[0-9]+$/;
    var only3characters = /^.{3}$/;

    $scope.change = checkInput;
    function checkInput() {
      
        if($scope.model.nameOfCard == null || $scope.model.nameOfCard == '') {
            $scope.errorNameOfCard = "* Yêu cầu nhập tên chủ thẻ !";
            $scope.tNameOfCard = true;
        }
        else if (haveNumber.test($scope.model.nameOfCard)) {
            $scope.errorNameOfCard = "* Tên chủ thẻ không để số !";
            $scope.tNameOfCard = true;
        }
        else {
            $scope.tNameOfCard = false
        }

        if ($scope.model.cardNumber == null || $scope.model.cardNumber == '') {
            $scope.errorCardNumber = "* Yêu cầu nhập số thẻ !";
            $scope.tCardNumber = true;
        }
        else if (!$scope.model.cardNumber.match(/^[0-9]*$/)) {
            $scope.errorCardNumber = "* Yêu cầu nhập số thẻ chỉ số !";
            $scope.tCardNumber = true;
        }
        else {
            $scope.tCardNumber = false
        }

        if ($scope.model.ccv == null || $scope.model.ccv == '') {
            $scope.errorCcv = "* Yêu cầu CCV !";
            $scope.tCcv = true;
        }
        else if (!$scope.model.ccv.match(/^[0-9]*$/) || !only3characters.test($scope.model.ccv)) {
           $scope.errorCcv = "* Yêu cầu CCV chỉ số và tối đa 3 ký tự !";
            $scope.tCcv = true;
        }
        else {
            $scope.tCcv = false
         }
         if ($scope.tNameOfCard == false && $scope.tCardNumber == false && $scope.tCcv == false) { return true }
        else return false

    }

    $scope.cancel = function () {

        $uibModalInstance.dismiss('cancel');
        $rootScope.lock_screen = !$rootScope.lock_screen;
    };

});
