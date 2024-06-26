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


app.factory('dataservice', function ($http) {
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
            $http.post('link/api', data).success(callback);
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

app.controller('index', function ($scope, $compile, $rootScope, $http, $uibModal, DTOptionsBuilder, DTColumnBuilder, dataservice) {

   
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
        DTColumnBuilder.newColumn('id').withTitle('id').renderWith(function (data, type) {
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
        DTColumnBuilder.newColumn('teacher').withTitle('Giảng viên chính').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('maxStudents').withTitle('Số lượng học viên').renderWith(function (data, type, full) {
            return full.registeredStudents + "/" + full.maxStudents;
        }),
        DTColumnBuilder.newColumn('tuition').withTitle('Học phí').renderWith(function (data, type) {
            return data +" đ";
        }),
        DTColumnBuilder.newColumn('statusClasses').withTitle('trạng thái lớp học').renderWith(function (data, type) {
            if (data == "Mở đăng ký") {
                return `<span class="text-success">Mở đăng ký</span>`;
            } else if (data == "Lớp học kết thúc") {
                return `<span  class="text-danger">Lớp học kết thúc</span>`;
            } else if (data == "Đóng đăng ký") {
                return `<span  class="text-warning">Đóng đăng ký</span>`;
            } else { return data; }
            
        }),
        DTColumnBuilder.newColumn('statusRegister').withTitle('trạng thái đăng ký').renderWith(function (data, type) {
            if (data == "Đã đăng ký") {
                return `<span class="text-success">Đã đăng ký</span>`;
            //} else if (data == "") {
            //    return `<span  class="text-warning">Chưa đăng ký</span>`;
            } else { return ""; }

        }),
        DTColumnBuilder.newColumn('action').notSortable().withTitle('Thao tác').renderWith(function (data, type, full, meta) {
            if (full.statusClasses == "Mở đăng ký" && (full.statusRegister == "" || full.statusRegister == null)) {
                return ' <button type="button"  ng-click="register(' + full.id + ')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 17px; padding-right: 17px;background: #07b113;align-items: center;display:flex;">Đăng ký</button > ';
            } else if (full.statusClasses == "Mở đăng ký" && full.statusRegister == "Đã đăng ký") {
                return ' <button type="button"  ng-click="register(' + full.id + ')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 32px;width: 88.19px;background:#ff753b;align-items: center;display:flex;">Hủy</button > ';

            }
            else {
                return "";
            }

        }),
    ];

    //vm.reloadData = reloadData;
    //vm.dtInstance = {};

    //function reloadData(resetPaging) {
    //    vm.dtInstance.reloadData(callback, resetPaging);

    //};
    //function callback(json) {

    //};

    vm.dtOptions.data = [
        { id: 1, name: 'John Doe', grade: '3.1A', maxStudents: 70, registeredStudents:30, tuition: 2000000, statusClasses: "Mở đăng ký", year: 2035, statusRegister:"Đã đăng ký" ,teacher:"Nguyễn Văn Hưng"},
        { id: 2, name: 'Jane Smith', grade: '25A', maxStudents: 70 ,registeredStudents: 30, tuition: 2000000, statusClasses: "Đóng đăng ký", year: 2043, statusRegister: "", teacher: "Nguyễn Văn Hưng" },
        { id: 3, name: 'Bob Johnson', grade: '40A', maxStudents: 70, registeredStudents: 30, tuition: 2000000, statusClasses: "Lớp học kết thúc", year: 2015, statusRegister: "", teacher: "Nguyễn Văn Hưng" },
        { id: 6, name: 'Bob Johnson', grade: '40A', maxStudents: 40, registeredStudents: 30, tuition: 2000000, statusClasses: "Mở đăng ký", year: 2015, statusRegister: "", teacher: "Nguyễn Văn Hưng" },
    ];

    //$scope.response = {};
    // $http.get('http://localhost:3000/api/v1/student')
    //    .then(function (response) {
    //        $scope.response = response.data;
    //        vm.dtoptions.data = $scope.response.metadata;
    //    })
    //    .catch(function (error) {
    //        console.error('error:', error);
    //    });


    $scope.register = function (id) {

        
        dataservice.register($scope, function (result) {
            modalInstance.result.then(function () {
                $scope.reloadTable(); // Gọi hàm reloadTable để reload lại bảng
            })
            if (result.Error) {
                toastr.error("sjdfhkjsdfh");
            } else {
                App.toastrSuccess(result.Title);
                $uibModalInstance.close();
                $rootScope.reload();
            }
            App.unblockUI("#contentMain");
           
        });
        $uibModalInstance.close();
        
       
    }

    $scope.cancel = function () {
        $rootScope.lock_screen = !$rootScope.lock_screen;
        $uibModalInstance.dismiss('cancel');
    };

});