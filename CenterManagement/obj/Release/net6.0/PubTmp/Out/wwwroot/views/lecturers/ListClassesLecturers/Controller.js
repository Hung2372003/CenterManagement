var ctxfolder = "/views/lecturers/ListClassesLecturers";

var app = angular.module("App_ESEIM", ["ngRoute", "ngResource", "ui.bootstrap", "datatables"]);

//var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'ui.tinymce', 'dynamicNumber', 'ngTagsInput']);
var selectedItems = [];

app.controller("Ctrl_ESEIM", function ($scope, $rootScope) {

    $scope.hung = "nsjbsjkdf";
   

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
        .when("/attendance", {
            templateUrl: ctxfolder + '/attendance.html',
            controller: "attendance"
        })
        .otherwise({
            redirectTo: "/"
        });


});


app.controller('index', function ($scope, $compile, $rootScope, $http, $uibModal, DTOptionsBuilder, DTColumnBuilder) {

    vm = $scope;

    vm.dtOptions = DTOptionsBuilder.newOptions()
        // .withOption('ajax', {
        //        url: 'your-api-endpoint', // URL của API của bạn
        //        type: 'GET', // Loại yêu cầu (GET hoặc POST)
        //        dataSrc: 'metadata' // Tên thuộc tính trong phản hồi API chứa dữ liệu
        // })
        //.withDataProp('metadata')
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
            "info": "",
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

        DTColumnBuilder.newColumn('grade').withTitle('Lớp').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('subject').withTitle('Môn học').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('year').withTitle('Năm học').renderWith(function (data, type) {
            return data;
        }), 
        DTColumnBuilder.newColumn('totalLesson').withTitle('Tổng số buổi học').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('learned').withTitle('Số buổi đã dạy').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('tuition').withTitle('Học phí cần thu').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('status').notSortable().withTitle().renderWith(function (data, type, full, meta) {
           
            return ' <button type="button"  ng-click="attendance(' + full.Id + ')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 17px; padding-right: 17px;background: #ff6300;align-items: center;display:flex;">Điểm danh</button > ';
        }),


    ];

    vm.dtInstance = {};

    vm.dtOptions.data = [
        { Id: 1, subject: 'Listening', year: '2000', totalLesson: 15, learned: 2, grade: 'Grade 1' },
        { Id: 2, subject: 'reading', year: '2000', totalLesson: 14, learned: 4, grade: 'Grade 2' },
        { Id: 3, subject: 'wishtkjths', year: '2000', totalLesson: 17, learned: 7, grade: 'Grade 3' }
    ]


    $scope.attendance = function (Id) {
        console.log('Opening detail modal for student with id:', Id);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/attendance.html',
            controller: 'attendance',
            backdrop: 'static',
            size: 'lg',

            resolve: {
                classesId: function () {
                    return Id;
                }
            }
        });
        modalInstance.opened.then(function () {
            $('.modal').css({
                'display': 'block',
                'visibility': 'visible',
                'opacity': '1',
                'top': '10vh',
              
            });
            $('.modal-content').css({
                'top': '23px !important'
            });
        });
        //modalInstance.rendered.then(function () {
        //    var modalElement = angular.element(document.querySelector('.modal'));
        //    modalElement.addClass('modal-lg-detail');
        //});

        modalInstance.result.then(function () {
            $scope.reload();
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };


});



app.controller('attendance', function ($scope, $uibModalInstance, $rootScope, $http, classesId, $compile, $uibModal, DTOptionsBuilder, DTColumnBuilder) {


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

        DTColumnBuilder.newColumn('name').withTitle('Tên học viên').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('dateBirth').withTitle('Ngày sinh').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('address').withTitle('Địa chỉ').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('startTime').withTitle('Buổi x').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('endTime').withTitle('Buổi y').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn(null).withTitle('Select').notSortable()
            .renderWith(function (data, type, full, meta) {
                return '<input type="checkbox" ng-model="ng'+ full.id +'" ng-change="toggleSelection(' + full.id +')">';
            }),
    ];
    
    //vm.dtColumns.push(DTColumnBuilder.newColumn(null).withTitle('iddjfh').renderWith(function (data, type) {
    //    return data;
    //}),)





    vm.dtInstance = {};
    vm.dtOptions.data = [
        { id: 1, subject: 'Listening', year: '2000', totalLesson: 15, learned: 2, grade: 'Grade 1' },
        { id: 2, subject: 'reading', year: '2000', totalLesson: 14, learned: 4, grade: 'Grade 2' },
        { id: 3, subject: 'wishtkjths', year: '2000', totalLesson: 17, learned: 7, grade: 'Grade 3' }       
    ]


    $scope.toggleSelection = function (item) {
        var idx = selectedItems.indexOf(item);
        if (idx > -1) {
            selectedItems.splice(idx, 1);
        } else {
            selectedItems.push(item);
        }
    };

    $scope.getSelectedIds = function () {
        console.log(selectedItems);
    };
});



