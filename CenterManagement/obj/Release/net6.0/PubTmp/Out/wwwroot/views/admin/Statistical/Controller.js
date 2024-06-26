var ctxfolder = "/views/admin/Statistical";

var app = angular.module("App_ESEIM", ["ngRoute", "ngResource", "ui.bootstrap", "datatables"]);

//var app = angular.module('App_ESEIM', ["ui.bootstrap", "ngRoute", "ngCookies", "ngValidate", "datatables", "datatables.bootstrap", "pascalprecht.translate", "ngJsTree", "treeGrid", 'datatables.colvis', "ui.bootstrap.contextMenu", 'datatables.colreorder', 'angular-confirm', 'ui.select', 'ui.tinymce', 'dynamicNumber', 'ngTagsInput']);

app.controller("Ctrl_ESEIM", function ($scope, $rootScope) {



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


    jQuery(document).ready(function () {
        // ECHARTS
        require.config({
            paths: {
                echarts: 'Schedule/assets/global/plugins/echarts/'
            }
        });

        // DEMOS
        require(
            [
                'echarts',
                'echarts/chart/bar',
         
                'echarts/chart/line',
          
            ],
            function (ec) {
                //--- BAR ---
                var myChart = ec.init(document.getElementById('echarts_bar'));
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: [ 'Số lượng học sinh']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: {
                                show: true
                            },
                            dataView: {
                                show: true,
                                readOnly: false
                            },
                            magicType: {
                                show: true,
                                type: ['line', 'bar']
                            },
                            restore: {
                                show: true
                            },
                            saveAsImage: {
                                show: true
                            }
                        }
                    },
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                    }],
                    yAxis: [{
                        type: 'value',
                        splitArea: {
                            show: true
                        }
                    }],
                    series: [{
                        name: 'Số lượng học sinh',
                        type: 'bar',
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 0]
                    }]
                });

                
             
            }
        );
    });

});