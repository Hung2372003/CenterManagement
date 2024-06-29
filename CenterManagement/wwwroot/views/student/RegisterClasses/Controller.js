var ctxfolder = "/views/student/RegisterClasses";

var app = angular.module("App_ESEIM", ["ngRoute", "ngResource", "ui.bootstrap", "datatables"]);

//var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'ui.tinymce', 'dynamicNumber', 'ngTagsInput']);

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


app.factory('dataservice', function ($http, $window) {
    $http.defaults.headers.common["x-requested-with"] = "xmlhttprequest";
    var headers = {
        "content-type": "application/json;odata=verbose",
        "accept": "application/json;odata=verbose",
    }
    var submitformupload = function (url, data, callback) {
        var req = {
            method: 'post',
            url: url,
            headers: {
                'content-type': undefined
            },
            beforesend: function () {
                app.blockui({
                    target: "#modal-body",
                    boxed: true,
                    message: 'loading...'
                });
            },
            complete: function () {
                app.unblockui("#modal-body");
            },
            data: data
        }
        $http(req).success(callback);
    };
    return {
        register: function (data, callback) {
            $http.post('http://localhost:3000/api/v1/class/student-enroll', data, {
                headers: {
                    'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                callback(response.data);
            }, function (error) {
                $window.location.href = '/home/error';
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
        .otherwise({
            redirectTo: "/"
        });



});

app.controller('index', function ($scope, $compile, $rootScope, $http, $uibModal, DTOptionsBuilder, DTColumnBuilder, dataservice, $window) {

   
    vm = $scope;

    vm.dtOptions = DTOptionsBuilder.newOptions()

        //.withOption('ajax', {
        //    url: 'your-api-endpoint', // URL của API của bạn
        //    type: 'GET', // Loại yêu cầu (GET hoặc POST)
        //    dataSrc: 'data' // Tên thuộc tính trong phản hồi API chứa dữ liệu
        //})

        //.withOption('ajax', {
        //    url: "/TimekeepingData/HRLeaveType/JTable",
        //    beforeSend: function (jqXHR, settings) {
        //        App.blockUI({
        //            target: "#contentMain",
        //            boxed: true,
        //            message: 'loading...'
        //        });
        //    },
        //    type: 'POST',
        //    data: function (d) {
        //        d.Code = $scope.model.Code;
        //        d.Name = $scope.model.Name;
        //        d.Coefficient = $scope.model.Coefficient;
        //        d.IsSubsidize = $scope.model.IsSubsidize;

        //    },
        //    complete: function () {
        //        App.unblockUI("#contentMain");
        //    }
        //})
        //.withDataProp('data') // Cách cũ để chỉ định thuộc tính dữ liệu

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
            { targets: 0, visible: false },  // Ẩn cột đầu tiên          
        ])
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        })
      
        //.withOption('initComplete', function (settings, json) {
        // /*   vm.dtInstance = settings.oInstance.api(); // Gán đối tượng DataTable API vào vm.dtInstance*/
        //});

       
    vm.dtColumns = [
        DTColumnBuilder.newColumn('_id').withTitle('id').renderWith(function (data, type) {
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
        //DTColumnBuilder.newColumn('teacher').withTitle('Giảng viên chính').renderWith(function (data, type) {
        //    return data;
        //}),
        DTColumnBuilder.newColumn('maxStudents').withTitle('Số lượng học viên').renderWith(function (data, type, full) {
            return full.registeredStudents + "/" + full.maxStudents;
        }),
        DTColumnBuilder.newColumn('tuition').withTitle('Học phí').renderWith(function (data, type) {
            return data +" đ";
        }),
        DTColumnBuilder.newColumn('statusClasses').withTitle('trạng thái lớp học').renderWith(function (data, type) {
            if (data == "open") {
                return `<span class="text-success">Mở đăng ký</span>`;
            } else if (data == "end") {
                return `<span  class="text-danger">Lớp học kết thúc</span>`;
            } else if (data == "close") {
                return `<span  class="text-warning">Đóng đăng ký</span>`;
            } else { return data; }
            
        }),
        DTColumnBuilder.newColumn('statusRegister').withTitle('trạng thái đăng ký').renderWith(function (data, type) {
            if (data == true) {
                return `<span class="text-success">Đã đăng ký</span>`;
            //} else if (data == "") {
            //    return `<span  class="text-warning">Chưa đăng ký</span>`;
            } else { return ""; }

        }),
        DTColumnBuilder.newColumn('action').notSortable().withTitle('Thao tác').renderWith(function (data, type, full, meta) {
            if (full.statusClasses == "open" && (full.statusRegister == false || full.statusRegister == null)) {
                return ' <button type="button"  ng-click="register(' + "'" + full._id + "'" + ')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 17px; padding-right: 17px;background: #07b113;align-items: center;display:flex;">Đăng ký</button > ';
            } else if (full.statusClasses == "open" && full.statusRegister == true) {
                return ' <button type="button"  ng-click="register(' + "'" + full._id + "'" + ')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 32px;width: 88.19px;background:#ff753b;align-items: center;display:flex;">Hủy</button > ';

            }
            else {
                return "";
            }

        }),
    ];


    vm.dtInstance = {};

    //function reloadData(resetPaging) {
    //    vm.dtInstance.reloadData(callback, resetPaging);

    //};
    //function callback(json) {

    //};

    $scope.response = {};
    $http.get('http://localhost:3000/api/v1/class/student?studentId=66640e7af97700fcfddf05cd', {
        headers: {
            'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            $scope.response = response.data;
            vm.dtOptions.data = $scope.response.metadata;
        })
        .catch(function (error) {
            $window.location.href = '/home/error';
            console.error('error:', error);
        });


    $scope.register = function (_id) {
       
        dataservice.register({'classId': _id}, function (result) {
            toastr.success(result)
            //modalInstance.result.then(function () {
            //    $scope.reloadTable(); // Gọi hàm reloadTable để reload lại bảng
            //})
            toastr.success("sjdfhkjsdfh");
           
        });
    }

    $scope.cancel = function () {
        $rootScope.lock_screen = !$rootScope.lock_screen;
        $uibModalInstance.dismiss('cancel');
    };

});