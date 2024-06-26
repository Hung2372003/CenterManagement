var ctxfolder = "/views/admin/CenterTeacher";

var app = angular.module("App_ESEIM", ["ngRoute", "ngResource", "ui.bootstrap", "datatables"]);

//var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'ui.tinymce', 'dynamicNumber', 'ngTagsInput']);

app.controller("Ctrl_ESEIM", function ($scope, $rootScope) {


    $rootScope.studentData = [
        { id: 1, subject: 'tiếng anh', year: '2024', grade: "3.1", maxStudents: 70, registerStudent: 30, tuition: 20000000, statusClasses: "Mở đăng ký" },
        { id: 2, subject: 'tiếng anh', year: '2024', grade: "3.1", maxStudents: 70, registerStudent: 30, tuition: 70000000, statusClasses: "Đóng đăng ký" },
        { id: 3, subject: 'tiếng anh', year: '2024', grade: "3.1", maxStudents: 70, registerStudent: 30, tuition: 90000000, statusClasses: "Lớp học kết thúc" }
    ]




    $rootScope.gradeData = [
        { id: 1, teacherId: 'Nguyễn Văn Hưng', topic: '2024', grade: "3.1", startDate: "23/7/2024", startTime: "7h00", endTime: "10h30" },
        { id: 2, teacherId: 'Vữ Công Hậu', topic: '2024', grade: "3.1", startDate: "28/7/2024", startTime: "7h00", endTime: "10h30" },
        { id: 3, teacherId: 'Đăng Minh Phương', topic: '2024', grade: "3.1", startDate: "31/7/2024", startTime: "7h00", endTime: "10h30" }
    ]

});

app.factory('dataservice', function ($http) {
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
            $http.post('link/api', data).success(callback);
        },
        addGrades: function (data, callback) {
            $http.post('//', data).success(callback);
        },
        close: function (data, callback) {
            $http.post('//', data).success(callback);
        },
        delete: function (data, callback) {
            $http.post('//', data).success(callback);
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

app.controller('index', function ($scope, $compile, $rootScope, $http, $uibModal, DTOptionsBuilder, DTColumnBuilder) {


    vm = $scope;
    vm.dtOptions = DTOptionsBuilder.newOptions()

        .withPaginationType('full_numbers')
        .withDisplayLength(9)
        .withOption('order', [0, 'desc'])
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
        DTColumnBuilder.newColumn('id').withTitle('ID').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('Name').withTitle('Tên giảng viên').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('Addresses').withTitle('Địa chỉ').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('Email').withTitle('Email').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('salary').withTitle('Tổng lương tháng này').renderWith(function (data, type) {
            return data ;
        }),

        DTColumnBuilder.newColumn('action').notSortable().withTitle('Thao tác').renderWith(function (data, type, full, meta) {
    
            return ' <button type="button"  ng-click="pay(' + full.Id + ')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 17px; padding-right: 17px;background: #07b113;align-items: center;display:flex;">Đăng ký</button > ';
        })
    ];

    vm.dtInstance = {};
    vm.dtOptions.data = $rootScope.studentData;


    //$scope.response = {};
    // $http.get('http://localhost:3000/api/v1/student')
    //    .then(function (response) {
    //        $scope.response = response.data;
    //        vm.dtOptions.data = $scope.response.metadata;
    //    })
    //    .catch(function (error) {
    //        console.error('Error:', error);
    //    });




})