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


app.controller('index', function ($scope, $compile, $rootScope, $http, $uibModal, DTOptionsBuilder, DTColumnBuilder, $window) {

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
            "infoEmpty": "Bạn chưa đăng ký lớp học nào",
            "infoFiltered": "(lọc từ _MAX_ mục)",
            "zeroRecords": "Bạn chưa đăng ký lớp học nào"
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

        DTColumnBuilder.newColumn('grade').withTitle('Lớp').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('name').withTitle('Tên lớp').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('year').withTitle('Năm học').renderWith(function (data, type) {
            return data;
        }), 
        //DTColumnBuilder.newColumn('totalLesson').withTitle('Tổng số buổi học').renderWith(function (data, type) {
        //    return data;
        //}),
        //DTColumnBuilder.newColumn('learned').withTitle('Số buổi đã dạy').renderWith(function (data, type) {
        //    return data;
        //}),
        DTColumnBuilder.newColumn(null).withTitle('Học viên').renderWith(function (data, type,full) {
            return full.students.length +"/"+full.maxStudents ;
        }),
        DTColumnBuilder.newColumn('tuition').withTitle('Học phí').renderWith(function (data, type) {
            return data +" $";
        }),
        DTColumnBuilder.newColumn('status').withTitle('Trạng thái').renderWith(function (data, type) {
            if (data == "open") {
                return `<span class="text-success">Đang mở đăng ký</span>`;
            } else if (data == "end") {
                return `<span  class="text-danger">Lớp học kết thúc</span>`;
            } else if (data == "close") {
                return `<span  class="text-warning">Đã đóng đăng ký</span>`;
            } else { return data; }
        }),
        DTColumnBuilder.newColumn('status').notSortable().withTitle().renderWith(function (data, type, full, meta) {
            if (data == "end" || data == "open") { return "" }
            else return ' <button type="button"  ng-click="attendance(' + "'" + full._id + "'" + ')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 17px; padding-right: 17px;background: #ff6300;align-items: center;display:flex;">Điểm danh</button > ';
        }),


    ];

    vm.dtInstance = {};

    loadData();
    function loadData() {
        $http.get('http://localhost:3000/api/v1/class/teacher', {
            headers: {
                'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            vm.dtOptions.data = response.data.metadata;
            console.log('Response:', $scope.response);
        })
            .catch(function (error) {
                console.error('Error:', error);
                $window.location.href = '/home/error';
            });
    }



    $scope.attendance = function (_id) {
        console.log('Opening detail modal for student with id:', _id);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/attendance.html',
            controller: 'attendance',
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

    $scope.studentList = [];
    $scope.lesson = [];
    


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
            { targets: 0, visible: true },  // Ẩn cột đầu tiên          
        ])
        .withOption('createdRow', function (row, data, dataIndex) {
            $compile(angular.element(row).contents())($scope);
        });


    $http.get('http://localhost:3000/api/v1/class/attendance?classId=' + classesId)
        .then(function (response) {

            vm.dtOptions.data = response.data.metadata.studentList;
            $scope.studentList = response.data.metadata.studentList;
            $scope.lesson = response.data.metadata.lesson;
            loadColum();
            loadcolum2($scope.lesson)
            console.log('Response:', $scope.response);
        })
        .catch(function (error) {
            console.error('Error:', error);
        });

    function loadColum() { 
    vm.dtColumns = [
        DTColumnBuilder.newColumn('_id').withTitle('Mã học viên').renderWith(function (data, type,full) {
            return data;
        }),

        DTColumnBuilder.newColumn('name').withTitle('Tên học viên').renderWith(function (data, type) {
            return data;
        }),
        //DTColumnBuilder.newColumn(null).withTitle('Select').notSortable()
        //    .renderWith(function (data, type, full, meta) {
        //        return '<input type="checkbox" ng-model="ng'+ full._id +'" ng-change="toggleSelection(' + full._id +')">';
        //    }),
        ];
    }
    function loadcolum2(lessons) {
        lessons.forEach(function (lesson, index) {
            vm.dtColumns.push(
                DTColumnBuilder.newColumn(null).withTitle(Tdate(lesson.startTime)).renderWith(function (data) {
                    return ""
                    //var isAbsent = data.absent.includes(lesson._id);
                    //return '<input type="checkbox" ' + (isAbsent ? 'checked' : '') + ' ng-model="ng' + lesson._id + '" ng-change="toggleSelection(\'' + lesson._id + '\')">';
                })
            );
        });
    }

    //vm.dtColumns.push(DTColumnBuilder.newColumn(null).withTitle('iddjfh').renderWith(function (data, type) {
    //    return data;
    //}),)

    function Tdate(x) {
        var datePart = x.substring(0, 10);
   return datePart;
    }



    vm.dtInstance = {};
    //vm.dtOptions.data = [
    //    { id: 1, subject: 'Listening', year: '2000', totalLesson: 15, learned: 2, grade: 'Grade 1' },
    //    { id: 2, subject: 'reading', year: '2000', totalLesson: 14, learned: 4, grade: 'Grade 2' },
    //    { id: 3, subject: 'wishtkjths', year: '2000', totalLesson: 17, learned: 7, grade: 'Grade 3' }       
    //]


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



