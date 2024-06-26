var ctxfolder = "/views/Parents/ParentsSonClasses";


var app = angular.module("App_ESEIM", ["ngRoute", "ngResource", "ui.bootstrap", "datatables"]);

//var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'ui.tinymce', 'dynamicNumber', 'ngTagsInput']);

app.controller("Ctrl_ESEIM", function ($scope,$rootScope) {

   
    $rootScope.gradeData = [
        { id: 1, teacherId: 'Nguyễn Văn Hưng', topic: '2024', grade: "3.1", startDate: "23/7/2024", startTime: "7h00", endTime: "10h30" },
        { id: 2, teacherId: 'Vữ Công Hậu', topic: '2024', grade: "3.1", startDate: "28/7/2024", startTime: "7h00", endTime: "10h30" },
        { id: 3, teacherId: 'Đăng Minh Phương', topic: '2024', grade: "3.1", startDate: "31/7/2024", startTime: "7h00", endTime: "10h30" }
    ]


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
        //.otherwise({
        //    redirectTo: "/"
        //});



});




app.controller('index', function ($scope,$compile,$rootScope, $http, $timeout, $uibModal, DTOptionsBuilder, DTColumnBuilder ) {

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
        DTColumnBuilder.newColumn('id').withTitle('ID').renderWith(function (data, type) {
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
        DTColumnBuilder.newColumn('teacher').withTitle('Giảng viên chính').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('totalLesson').withTitle('Tổng số buổi học').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('learned').withTitle('Đã học').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('skipClass').withTitle('Đã nghỉ').renderWith(function (data, type,full) {
            return  `<div style="display: flex;justify-content: space-between;align-items: center;"><span  class="text-danger">` + data + `</span>` + '<button title="Các buổi học" ng-click="detail(' + full.Id + ')" style="width: 25px;pointer-events: auto !important; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgb(0 3 6 / 97%);border-radius: 50%;margin-right: 7px;color: white;background: #3d9afb;padding-top: 1px; " class="btn btn-icon-only btn-circle btn-outline-button-icon"><i class="fa-solid fa-eye"></i></button></div>';
        }),
        DTColumnBuilder.newColumn('tuition').withTitle('Học phí').renderWith(function (data, type) {
            return data + "đ";
        }),
        DTColumnBuilder.newColumn('tuitionUnpaid').withTitle('Còn phải đóng').renderWith(function (data, type) {
            return `<span  class="text-danger">` + data + `</span>`;
        }),
        DTColumnBuilder.newColumn('action').notSortable().withTitle('Thanh toán học phí').renderWith(function (data, type, full, meta) {
            if (full.tuitionUnpaid || full.tuitionUnpaid != 0)
            return ' <button type="button"  ng-click="pay(' + full.Id + ')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 17px; padding-right: 17px;background: #ff6300;align-items: center;display:flex;">Thanh toán</button > ';
        }),

    ];

    vm.dtInstance = {};

    vm.dtOptions.data = [
        { id: 1, name: 'Listening', year: '2000', totalLesson: 15, learned: 2, grade: 'Grade 1', teacher:"Nguyễn Văn Hưng", skipClass: 1, tuition: 20000000, tuitionUnpaid :400000},
        { id: 2, name: 'reading', year: '2000', totalLesson: 14, learned: 4, grade: 'Grade 2', teacher: "Nguyễn Văn Hưng", skipClass: 2, tuition: 20000000, tuitionUnpaid: 400000 } ,
        { id: 3, name: 'wishtkjths', year: '2000', totalLesson: 17, learned: 7, grade: 'Grade 3', teacher: "Nguyễn Văn Hưng", skipClass: 2, tuition: 20000000, tuitionUnpaid: 400000 }
    ];

   
    //vm.dtOptions.data = $http.get('http://localhost:3000/api/v1/student/infor?')
    //    .then(function (response) {
    //        $scope.data = response.data;
    //    })
    //    .catch(function (error) {
    //        console.error('Error:', error);
    //    });
    function callback(json) {

    }

    $scope.detail = function (id) {
        console.log('Opening detail modal for student with id:', id);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/detail.html',
            controller: 'detail',
            backdrop: 'static',
            size: 'lg',

            resolve: {
                studentId: function () {
                    return id;
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


   


    $scope.reload = function () {
        reloadData(true);
    }
   



});

app.controller('detail', function ($scope, $uibModalInstance, $rootScope, $http, studentId, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder) {


    //$http.post('http://localhost:3000/api/v1/student', classesId)
    //    .then(function (response) {

    //        vm.dtOptions.data = response;
    //        console.log('Response:', $scope.response);
    //    })
    //    .catch(function (error) {
    //        console.error('Error:', error);
    //    });



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
        DTColumnBuilder.newColumn('id').withTitle('id').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('startDate').withTitle('Buổi học').renderWith(function (data, type) {
            return `<span class="text-danger">` + data + `</span>`;
        }),
        DTColumnBuilder.newColumn('startTime').withTitle('Thời gian bắt đầu').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('endTime').withTitle('Thời Gian kết thúc').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('teacherId').withTitle('Giáo viên').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('topic').withTitle('Bài giảng').renderWith(function (data, type) {
            return data;
        }),
      
    ];

    vm.dtInstance = {};
    vm.dtOptions.data = $rootScope.gradeData;

    


});


