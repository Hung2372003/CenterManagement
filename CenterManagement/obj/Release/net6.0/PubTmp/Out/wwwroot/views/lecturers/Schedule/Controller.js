var ctxfolder = "/views/lecturers/Schedule";

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

app.controller('index', function ($scope, $compile, $rootScope, $http, $uibModal, $window) {



    var AppCalendar = function () {

        return {
            //main function to initiate the module
            init: function () {
                this.initCalendar();
            },

            initCalendar: function () {

                if (!jQuery().fullCalendar) {
                    return;
                }

                var date = new Date();
                var d = date.getDate();
                var m = date.getMonth();
                var y = date.getFullYear();
                var h = {};

                if (App.isRTL()) {
                    if ($('#calendar').parents(".portlet").width() <= 720) {
                        $('#calendar').addClass("mobile");
                        h = {
                            right: 'title, prev, next',
                            center: '',
                            left: 'agendaDay, agendaWeek, month, today'
                        };
                    } else {
                        $('#calendar').removeClass("mobile");
                        h = {
                            right: 'title',
                            center: '',
                            left: 'agendaDay, agendaWeek, month, today, prev,next'
                        };
                    }
                } else {
                    if ($('#calendar').parents(".portlet").width() <= 720) {
                        $('#calendar').addClass("mobile");
                        h = {
                            left: 'title, prev, next',
                            center: '',
                            right: 'today,month,agendaWeek,agendaDay'
                        };
                    } else {
                        $('#calendar').removeClass("mobile");
                        h = {
                            left: 'title',
                            center: '',
                            right: 'prev,next,today,month,agendaWeek,agendaDay'
                        };
                    }
                }

                var initDrag = function (el) {
                    var eventObject = {
                        title: $.trim(el.text()) 
                    };
                    el.data('eventObject', eventObject);         
                    el.draggable({
                        zIndex: 999,
                        revert: true,
                        revertDuration: 0 
                    });
                };



                $http.get('http://localhost:3000/api/v1/teacher/schedule', {
                    headers: {
                        'Authorization': 'Bearer ' + $window.localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (response) {
                        if (response == "Authenticate failed!") {
                            $window.location.href = '/home/error';
                            return
                        }
                        var events = response.data.metadata.map(function (celender) {
                            return {
                                title: 'classId: ' + celender.classId + '<br>' + 'Topic: ' + celender.topic,

                                start: celender.startTime,
                                end: celender.endTime,     
                      
                            };
                        });
                        $('#calendar').fullCalendar({
                            header: h,
                            defaultView: 'agendaWeek',
                            slotMinutes: 15,
                            editable: true,
                            droppable: true,
                            drop: function (date, allDay) {
                                var originalEventObject = $(this).data('eventObject');
                                var copiedEventObject = $.extend({}, originalEventObject);
                                copiedEventObject.start = date;
                                copiedEventObject.allDay = allDay;
                                copiedEventObject.className = $(this).attr("data-class");
                                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
                                if ($('#drop-remove').is(':checked')) {
                                    $(this).remove();
                                }
                            },
                            events: events,
                            eventRender: function (event, element) {
                                element.find('.fc-title').html(event.title); // Render title with HTML
                            }
                 
                        });
                    })
                    .catch(function (error) {
                        $window.location.href = '/home/error';
                        console.error('error:', error);
                        
                    });

            }

        };

    }();

    jQuery(document).ready(function () {
        AppCalendar.init();
    });

});