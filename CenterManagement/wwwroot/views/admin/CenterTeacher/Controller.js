var ctxfolder = "/views/admin/CenterTeacher";
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
        pay: function (data, callback) {
            $http.post('http://localhost:3000/api/v1/payment/pay-salary', data, {
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
        DTColumnBuilder.newColumn('_id').withTitle('Mã giảng viên').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('name').withTitle('Tên giảng viên').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('address').withTitle('Địa chỉ').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('email').withTitle('Email').renderWith(function (data, type) {
            return data;
        }),
        DTColumnBuilder.newColumn('dob').withTitle('ngày sinh').renderWith(function (data, type) {
            return setDate(data);
        }),
        DTColumnBuilder.newColumn('render').withTitle('Giới tính').renderWith(function (data, type) {
            if (data == "male") { return "Nam" }
            else
            return "Nữ";
        }),
        DTColumnBuilder.newColumn('salary').withTitle('Lương tháng').renderWith(function (data, type) {
            return data ;
        }),
        DTColumnBuilder.newColumn(null).withTitle('Còn phải trả').renderWith(function (data, type, full) {
            if (full.prePaid == full.salary) {
                return `<span class="text-success">0</span>`

            } else { return `<span  class="text-warning">` + (full.salary - full.prePaid) + `</span>`; }
        }),
        DTColumnBuilder.newColumn('dateOflastPaid').withTitle('Thanh toán gần nhất').renderWith(function (data, type) {
            if (data == null) {
                return `<span  class="text-warning">Chưa có giao dịch nào</span>`
            }
            else return setTime(data);
        }),

        DTColumnBuilder.newColumn('totalPaid').withTitle('Tổng số chi trả').renderWith(function (data, type) {
            return data;
        }),

        DTColumnBuilder.newColumn('action').notSortable().withTitle('Thao tác').renderWith(function (data, type, full, meta) {
            if (full.prePaid == full.salary) {
                return ""
            } else
                return ' <button type="button"  ng-click="pay(' + "'" + full._id + "'" +')" class="btn btn-gradient-danger btn-icon-text click-button" style="height: 30px; padding-left: 17px; padding-right: 17px;background: #07b113;align-items: center;display:flex;">Trả lương</button > ';
        })
    ];

    vm.dtInstance = {};
    vm.dtOptions.data = $rootScope.studentData;

    loadData()

    function loadData() {


        $http.get('http://localhost:3000/api/v1/teacher', {
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
    $scope.pay = function (_id) {
        var modalInstance = $uibModal.open({
            templateUrl: ctxfolderMessage + '/messageConfirmUpdate.html',
            windowClass: "message-center",
            controller: function ($scope, $uibModalInstance) {
                $scope.message = "Xác nhận mở đăng ký lớp ?";
                $scope.ok = function () {
                    dataservice.pay({ teacherId: _id }, function (rs) {
                        toastr.success(rs.message);
                        $uibModalInstance.dismiss('cancel');
                        loadData();
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            size: '25',
        });
        modalInstance.result.then(function (d) {
            $scope.reloadNoResetPage();
        }, function () {
        });
    };
})