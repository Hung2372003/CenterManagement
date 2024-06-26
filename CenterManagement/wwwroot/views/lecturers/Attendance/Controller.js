var ctxfolder = "/views/lecturers/Attendance";

var app = angular.module("App_ESEIM", ["ngRoute", "datatables"]);

//var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'ui.tinymce', 'dynamicNumber', 'ngTagsInput']);

app.controller("Ctrl_ESEIM", function ($scope) {

    $scope.hung = "nsjbsjkdf";

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


app.controller('index', function ($scope, $rootScope, $http, DTOptionsBuilder, DTColumnBuilder) {

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

    vm.dtColumns = [
        DTColumnBuilder.newColumn('Id').withTitle('ID').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('Name').withTitle('Tên').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('DateBirth').withTitle('Ngày sinh').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('Absent').withTitle('Số buổi vắng').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('Address').withTitle('Địa chỉ').renderWith(function (data, type) {
            return data;
        }),
    
        DTColumnBuilder.newColumn('action').notSortable().withTitle('Điểm danh').renderWith(function (data, type, full, meta) {
            return '<button  title="chỉnh sửa" ng-click="edit(' + full.Id + ')" style = "width: 25px; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgba(85,168,253,0.45);" class="btn btn-icon-only btn-circle btn-outline blue"><i class="fa-solid fa-pencil"></i></button>'

        })
     
    ];

    vm.dtInstance = {};

    vm.dtOptions.data = [
        { id: 1, Name: 'John Doe', Class: '3.1A', learned: 4, Absent: 2 },
        { id: 2, Name: 'Jane Smith', Class: '25A', learned: 4, Absent: 4 },
        { id: 3, Name: 'Bob Johnson', Class: '40A', learned: 4, Absent: 7 }
    ];



});




