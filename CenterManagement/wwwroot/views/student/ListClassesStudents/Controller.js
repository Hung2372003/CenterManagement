var ctxfolder = "/views/student/ListClassesStudents";

var app = angular.module("App_ESEIM", ["ngRoute", "ngResource", "ui.bootstrap", "datatables"]);

//var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'ui.tinymce', 'dynamicNumber', 'ngTagsInput']);

app.controller("Ctrl_ESEIM", function ($scope, $rootScope) {

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


app.controller('index', function ($scope, $compile, $rootScope, $http, $uibModal, DTOptionsBuilder, DTColumnBuilder, $window) {



    





    vm = $scope;
    vm.dtOptions = DTOptionsBuilder.newOptions()


        //.withOption('ajax', {
        //    url: 'your-api-endpoint', // URL của API của bạn
        //    type: 'GET', // Loại yêu cầu (GET hoặc POST)
        //    dataSrc: 'data' // Tên thuộc tính trong phản hồi API chứa dữ liệu
        //})
        //.withDataProp('data') // Cách cũ để chỉ định thuộc tính dữ liệu


        
        .withPaginationType('full_numbers')
        .withDisplayLength(9)
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
        });
        //.withOption('initComplete', function (settings, json) {
        //    vm.dtInstance = this.api(); // Gán đối tượng DataTable API vào vm.dtInstance
        //});

    vm.dtColumns = [
        DTColumnBuilder.newColumn('_id').withTitle('ID').renderWith(function (data, type) {
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
        DTColumnBuilder.newColumn('maxStudents').withTitle('Số học sinh').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('tuition').withTitle('học phí').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('totalLesson').withTitle('Tổng số buổi học').renderWith(function (data, type) {
            return data;
        }),       
        DTColumnBuilder.newColumn('learned').withTitle('Số buổi đã học').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('skipClass').withTitle('Đã nghỉ').renderWith(function (data, type) {
            return `<span  class="text-danger">` + data +`</span>`;
        }),
 
    ];

    vm.dtInstance = {};

    //vm.dtOptions.data = [
    //    { id: 1, name: 'Listening', year: '2000', totalLesson: 15, learned: 2, grade: 'Grade 1', skipClass :1},
    //    { id: 2, name: 'reading', year: '2000', totalLesson: 14, learned: 4, grade: 'Grade 2', skipClass:2 },
    //    { id: 3, name: 'wishtkjths', year: '2000', totalLesson: 17, learned: 7, grade: 'Grade 3', skipClass :2}
    //];
    /*vm.dtOptions.data = $rootScope.studentData;*/


    $scope.response = {};
    $http.get('http://localhost:3000/api/v1/student/statusv2', {
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
            console.error('Error:', error);
            $window.location.href = '/home/error';
        });




    $scope.detail = function (Id) {
        console.log('Opening detail modal for student with id:', Id);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/detail.html',
            controller: 'detail',
            backdrop: 'static',
            size: 'lg',

            resolve: {
                studentId: function () {
                    return Id;
                }
            }
        });
        modalInstance.opened.then(function () {
            $('.modal').css({
                'display': 'block',
                'visibility': 'visible',
                'opacity': '1',
                'top': '30vh',
                'left': '23%'
            });
        });
        modalInstance.rendered.then(function () {
            var modalElement = angular.element(document.querySelector('.modal'));
            modalElement.addClass('modal-lg');
        });

        modalInstance.result.then(function () {
            $scope.reload();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });

    };

 



});



app.controller('detail', function ($scope, $uibModalInstance, $rootScope, studentId, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder, DTInstance) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
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
        DTColumnBuilder.newColumn('Id').withTitle('ID').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('date').withTitle('Thời gian').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('topic').withTitle('Bài giảng').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('teacherID').withTitle('Giáo viên').renderWith(function (data, type) {
            return data;
        }),

    ];

    vm.dtInstance = {};
    vm.dtOptions.data = $rootScope.studentData.lessons;

});





