var ctxfolder = "/views/admin/ListStudents";
var ctxfolderMessage = "/views/message-box";
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
        edit: function (data, callback) {
            $http.post('http://localhost:3000/api/v1/student/set-discount', data, {
                headers: {
                    'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                callback(response.data);
            }, function (error) {
               /* $window.location.href = '/home/error';*/
                console.error('Error:', error);
                toastr.error(error.data);

            });
        },
    }
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
        DTColumnBuilder.newColumn('_id').withTitle('Mã học viên').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('name').withTitle('Tên học viên').renderWith(function (data, type) {
            return data;
        }),
        //DTColumnBuilder.newColumn('addresses').withTitle('Địa chỉ').renderWith(function (data, type) {
        //    return data;
        //}),
       
        DTColumnBuilder.newColumn('address').withTitle('Địa chỉ').renderWith(function (data, type) {
            return data ;
        }),
        DTColumnBuilder.newColumn('discount').withTitle('Độ ưu tiên').renderWith(function (data, type,full) {
            return `<div style="display: flex;justify-content: space-between;align-items: center;"><span>` + data + `</span>` + '<button title="chỉnh sửa" ng-click="edit(' + "'" + full._id + "'" + ')" style="width: 25px;pointer-events: auto !important; height: 25px; padding: 0px;-webkit-box-shadow: 0 2px 5px 0 rgb(0 3 6 / 97%);border-radius: 50%;margin-right: 7px;color: white;background: #3d9afb;padding-top: 1px; " class="btn btn-icon-only btn-circle btn-outline-button-icon button-full "><i class="fa-solid fa-pen-to-square"></i></button></div>';
        }),
        //DTColumnBuilder.newColumn('action').notSortable().withTitle('').renderWith(function (data, type, full, meta) {
        //        return ' <button type="button"  ng-click="pay(' + "'" + full._id + "'" +')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 17px; padding-right: 17px;background: #07b113;align-items: center;display:flex;">Trả lương</button > ';
        //})
    ];

    vm.dtInstance = {};
    vm.dtOptions.data = $rootScope.studentData;

    loadData()

    function loadData() {


        $http.get('http://localhost:3000/api/v1/student', {
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




    function setTime(x) {
        var parts = x.split('T');
        $scope.date = parts[0];
        var timeParts = parts[1].split(':');
        $scope.time = parts[0]+" "+ timeParts[0] + 'h' + timeParts[1] 
        return $scope.time

    }
    function setDate(x) {
        var parts = x.split('T');
        $scope.date = parts[0];
        $scope.time = parts[1];
        return parts[0];
    }
    $scope.edit = function (_id) {
        $rootScope.lock_screen = !$rootScope.lock_screen;
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: ctxfolder + '/edit.html',
            controller: 'edit',
            backdrop: true,
            size: 'md',
            resolve: {
                studentId: function () {
                    return _id;
                }
            }
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

    };
})
app.controller('edit', function ($scope, $uibModalInstance, $rootScope, studentId, $http, $compile, $uibModal, dataservice) {

    $scope.model = {
        discount: 0,
        studentId: studentId
    }
    $scope.submit = function () {

        dataservice.edit($scope.model, function (responseData) {
            toastr.success(responseData.message);

        });
        $uibModalInstance.close();

    }
    $scope.cancel = function () {
        $rootScope.lock_screen = !$rootScope.lock_screen;
        $uibModalInstance.dismiss('cancel');
    };

});