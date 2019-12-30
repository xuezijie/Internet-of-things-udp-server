(function () {
    'use strict';

    angular.module('usrCloud', ['ui.bootstrap', 'LocalStorageModule', 'toastr', 'angular-echarts', 'tm.pagination'])
        .directive('onFinishRenderFilters', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$emit('ngRepeatFinished');
                        });
                    }
                }
            }
        })
        .directive('treeView', function () {
            return {
                restrict: 'AE',
                templateUrl: 'treeView.html',
                scope: {
                    treeData: '='
                },
                controller: function ($scope, httpRequest, phpHttpRequest) {
                    $scope.isLeaf = function (item) {
                        return !item.childrens || !item.childrens.length;
                    };
                    $scope.toggleExpandStatus = function (item) {
                        item.isExpand = !item.isExpand;
                    };
                }
            };
        })
        .controller('DeviceMapTrackPageCtrl', DeviceMapTrackPageCtrl)
        .controller('fireSolutionCtrl', fireSolutionCtrl)
        .controller('DataHistoryPageCtrl', DataHistoryPageCtrl)
        .controller('AlarmHistoryListPageCtrl', AlarmHistoryListPageCtrl)
        .controller('PreviewAlarmProcessCtrl', PreviewAlarmProcessCtrl)
        .controller('EditAlarmProcessCtrl', EditAlarmProcessCtrl)
        // .controller('HindranceCtrl',HindranceCtrl)//阻态控制器
        .run(function ($rootScope) {
            $rootScope.common_devid = "";
        });

    function fireSolutionCtrl($rootScope, $scope, httpRequest, phpHttpRequest, mqttService, $timeout, $location, localStorageService, $sce,$http, $interval, $uibModal) {
        //------------------根据域名显示大屏幕标题star-----------------------
        //获取主机名
        $scope.localhost = $location.host();
        $scope.project_name = '透传云监控大屏';
        $scope.project_logo = '';

        // $scope.map = new google.maps.Map(document.getElementById('allmap'), {
        //     zoom: 4,
        //     center: {lat: 36.676011, lng: 117.137735},
        //     mapTypeId: google.maps.MapTypeId.ROADMAP,
        //     zoomControl: false,
        //     streetViewControl: false,
        //     fullscreenControl: false,
        //     // zoomControlOptions: {
        //     //     position: google.maps.ControlPosition.LEFT_TOP
        //     // },
        //     mapTypeControlOptions:{
        //         mapTypeIds: []
        //     }
        // });
        $scope.map = new BMap.Map('allmap', {enableMapClick : false});
        $scope.map.centerAndZoom(new BMap.Point(119.335716, 37.423022), 8);
        $scope.map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_SMALL}));// 添加平移缩放控件
        $scope.map.enableInertialDragging(); // 开启惯性拖拽效果
        $scope.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        $scope.map.setMapStyle(
            {style:'midnight'}
        );


            $scope.params = {
                "domain":  $scope.localhost
            };
            $http({
                method: 'POST',
                url: apiUrl + '/project/getProjectByDomain',
                data: $scope.params,
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            }).then(function successCallback(response) {
                if(response.data.data!== ''){
                   // console.log(response)
                    $scope.project_name=response.data.data.project_name+'监控大屏';
                }else{

                    $scope.project_name='透传云监控大屏'
                }
            }, function errorCallback(response) {

            });
        //------------------根据域名显示大屏幕标题end-----------------------



        $scope.host = $location.protocol() + "://" + $location.host();
        var image = 'img/map.png';
        // var colorSys = {
        //     blue : "#2064ed",
        //     blueLight : "#6fb0de",
        //     blueDark : "#3f5a7b",
        //     green : "#22c48b",
        //     greenLight : "#1be4a0",
        //     orange : "#f18901",
        //     yellow : "#f1d301"
        // };
        // var styles=[];
        // styles.push([//亮色
        //     {
        //         stylers: [
        //             // {color:"#0093ff"},
        //             // {saturation:-40},//饱和度
        //             //{lightness:-20},亮度
        //             // {gamma:.6},
        //             // {invert_lightness:true},
        //             // {weight:.4}
        //         ]
        //     },
        //     {
        //         featureType:"landscape",
        //         stylers: [
        //             // {hue:colorSys.red},
        //             {lightness:40}
        //         ]
        //     }
        //     ,{//设置道路线条
        //         featureType: "road",
        //         //elementType: "geometry",
        //         stylers: [
        //             {lightness:20},
        //             {visibility:"simplified"}
        //         ]
        //     },
        //     {
        //         featureType:"water",
        //         stylers:[
        //             {hue:colorSys.blue},
        //             {lightness:-20},
        //             {saturation:-40}
        //         ]
        //     }
        //     // ,{//不显示道路名称
        //     // 	featureType: "road",
        //     // 	elementType: "labels",
        //     // 	stylers: [
        //     // 		{visibility:"off"}
        //     // 	]
        //     // }
        // ]);
        // styles.push([//暗色
        //     {
        //         stylers: [
        //             //{color:"#0093ff"},
        //             {saturation:-40},//饱和度
        //             //{lightness:-20},亮度
        //             {gamma:.6},
        //             {invert_lightness:true},
        //             {hue:"#0093ff"},
        //             {weight:.4}
        //         ]
        //     }
        //     ,{//设置道路线条
        //         featureType: "road",
        //         //elementType: "geometry",
        //         stylers: [
        //             {lightness:-20},
        //             {visibility:"simplified"}
        //         ]
        //     }
        //     // ,{//不显示道路名称
        //     // 	featureType: "road",
        //     // 	elementType: "labels",
        //     // 	stylers: [
        //     // 		{visibility:"off"}
        //     // 	]
        //     // }
        // ]);
        // styles.push([//暗色
        //     {
        //         stylers: [
        //             //{color:"#0093ff"},
        //             {saturation:-20},//饱和度
        //             //{lightness:-20},亮度
        //             {gamma:.6},
        //             {invert_lightness:true},
        //             {hue:"#0093ff"},
        //             {weight:.4}
        //         ]
        //     },
        //     {
        //         featureType:"landscape",
        //         stylers: [
        //             {hue:colorSys.blue},
        //             {lightness:-40},
        //             {saturation:50}
        //         ]
        //     }
        //     ,{//设置道路线条
        //         featureType: "road",
        //         //elementType: "geometry",
        //         stylers: [
        //             {hue:colorSys.blue},
        //             {lightness:-70},
        //             {saturation:60}
        //         ]
        //     },
        //     {
        //         featureType:"water",
        //         stylers:[
        //             {hue:colorSys.blue},
        //             {lightness:-30},
        //             {saturation: -20}
        //         ]
        //     }
        //     // ,{//不显示道路名称
        //     // 	featureType: "road",
        //     // 	elementType: "labels",
        //     // 	stylers: [
        //     // 		{visibility:"off"}
        //     // 	]
        //     // }
        // ]);
        // $scope.map.setOptions({styles:styles[2]});
        $scope.devArry = [];
        mqttService.init();
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };
        localStorageService.setPrefix('usrCloud.');
        $scope.account = localStorageService.get('User').account;
        time();
        findDimensions();
        resizeOnload();

        $(window).resize(function () {

                findDimensions();
                resizeOnload();

        });

            function resizeOnload() {
            setTimeout(function () {

                $scope.getFireCount();//火警概况
                $scope.getDevCount();//设备概况
                $("#subList").hide();
                sublistheight();

                $scope.getDevAndDevGroupCountByTime();//每月新增概况
                $scope.getAlarmHistory();//警情记录
                $scope.getGroupsList();//设备分组
                $scope.getDevList(0);//设备列表

            }, 100);
        }
        //分组下列表的高度
        function sublistheight(){
            var sublistHeight= parseInt( $("#subList").height())+"px";
            $("#cursonList").slimScroll({
                height:sublistHeight,
                width:'100%',
                size: '5px',
                color: '#0054a4',
                alwaysVisible: false,
                railVisible: true,
                railOpacity: 0.5,
                wheelStep: 10,
                allowPageScroll: false,
                disableFadeOut: false,
                position: 'right',
            });
        }
        var winHeight = 0;

        function findDimensions() {
            var winWidth;
            if (window.innerWidth) {
                winWidth = window.innerWidth;
            }
            else if ((document.body) && (document.body.clientWidth)) {
                winWidth = document.body.clientWidth;
            }
            var headerHeight = document.getElementById('header').offsetHeight;
            if (window.innerHeight)
            //winHeight = window.innerHeight;
                winHeight = window.outerHeight;
            else if ((document.body) && (document.body.clientHeight))
                winHeight = document.body.clientHeight;
            if (document.documentElement && document.documentElement.clientHeight) {
                winHeight = document.documentElement.clientHeight;
            }
            if (winWidth > 1600) {
                document.getElementById('main').style.height = (winHeight - headerHeight) * 0.98 + "px";
                document.getElementById('usr_left').style.height = (winHeight - headerHeight) * 0.98 - 20 + "px";
                document.getElementById('usr_right').style.height = (winHeight - headerHeight) * 0.98 - 20 + "px";
                // document.getElementById('panelDiv').style.height = document.getElementById('panelDiv').offsetHeight + "px";
                document.getElementById('mapTab').style.height = (winHeight - headerHeight) * 0.98 - 275 + "px";
                document.getElementById('allmap').style.height = document.getElementById('mapTab').offsetHeight - 44 + "px";
                document.getElementById('chart_panel7').style.height = document.getElementById('mapTab').offsetHeight - 33 + "px";
                document.getElementById('group_height').style.height = (winHeight - headerHeight) * 0.98 - 385 + "px";
                document.getElementById('scroll').style.height = document.getElementById('group_height').offsetHeight - 28 + "px";

                document.getElementById('scrollAlarm').style.height = document.getElementById('alarm_height').offsetHeight - 28 + "px";
            }
            else {
                document.getElementById('main').style.height = (winHeight - headerHeight) * 0.98 + "px";
                document.getElementById('usr_left').style.height = (winHeight - headerHeight) * 0.98 - 20 + "px";
                document.getElementById('usr_right').style.height = (winHeight - headerHeight) * 0.98 - 20 + "px";
                // document.getElementById('panelDiv').style.height = document.getElementById('panelDiv').offsetHeight + "px";
                document.getElementById('mapTab').style.height = (winHeight - headerHeight) * 0.98 - 230 + "px";
                document.getElementById('allmap').style.height = document.getElementById('mapTab').offsetHeight - 44 + "px";
                document.getElementById('chart_panel7').style.height = document.getElementById('mapTab').offsetHeight - 33 + "px";
                document.getElementById('group_height').style.height = (winHeight - headerHeight) * 0.98 - 285 + "px";
                document.getElementById('scroll').style.height = document.getElementById('group_height').offsetHeight - 28 + "px";
                document.getElementById('scrollAlarm').style.height = document.getElementById('alarm_height').offsetHeight - 28 + "px";
            }
            var mapWidth = document.getElementById('myTab2Content').offsetWidth;
            document.getElementById('allmap').style.width = mapWidth + 'px';
            document.getElementById('chart_panel7').style.width = mapWidth + 'px';

            // var swidth=document.getElementById('myTabContent').offsetWidth;
            // document.getElementById('chart_panel6').style.width=swidth+'px';
        }

        var t = null;
        t = setTimeout(time, 1000);//开始执行
        function time() {
            clearTimeout(t);//清除定时器
            var dt = new Date();
            var year = dt.getFullYear();
            var month = dt.getMonth() + 1;
            var day = dt.getDate();
            var h = dt.getHours();
            var m = dt.getMinutes();
            var s = dt.getSeconds();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (day >= 1 && day <= 9) {
                day = "0" + day;
            }
            if (h >= 0 && h <= 9) {
                h = "0" + h;
            }
            if (m >= 0 && m <= 9) {
                m = "0" + m;
            }
            if (s >= 0 && s <= 9) {
                s = "0" + s;
            }

            document.getElementById("time").innerHTML = "当前时间：" + year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
            t = setTimeout(time, 1000); //设定定时器，循环执行
        }

        $scope.subList=[];
        $scope.markers=[];
        $scope.devAlarm=[];

        //设备在线状态统计
        $scope.getDevCount = function () {
            var myChart1 = echarts.init(document.getElementById("chart_panel1"));
            httpRequest.request('getOnlineCountByUid', {}, true, 'post', function (response) {
                $scope.offlineCount = response.data.data.offlineCount;
                $scope.onlineCount = response.data.data.onlineCount;
                $scope.amountCount = $scope.offlineCount + $scope.onlineCount;
                $scope.onlineDevRate = ($scope.onlineCount / $scope.amountCount * 100).toFixed(2) + '%';

                var option1 = {
                    tooltip: {
                        trigger: 'item'
                    },
                    series: [
                        {
                            name: '设备状况',
                            type: 'pie',
                            radius: ['75%', '90%'],

                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                }
                            },
                            color: ['#f1d301', '#22c48b'],
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: $scope.offlineCount, name: '离线数'},
                                {value: $scope.onlineCount, name: '在线数'}
                            ]
                        }
                    ]
                };

                $(window).resize(function(){
                    myChart1.resize();
                });

                myChart1.setOption(option1);
            });

        };
        //报警状态统计
        $scope.getFireCount = function () {
            var myChart3 = echarts.init(document.getElementById("chart_panel3"));
            httpRequest.request('getAlarmHistoryStatusCount', {}, true, 'post', function (response) {

                $scope.processedCount = response.data.data.processedCount ? response.data.data.processedCount : 0;
                $scope.noProcessedCount = response.data.data.noProcessedCount ? response.data.data.noProcessedCount : 0;
                $scope.falsePositivesCount = response.data.data.falsePositivesCount ? response.data.data.falsePositivesCount : 0;
                $scope.noProcessedCountRate = ($scope.noProcessedCount / ($scope.processedCount + $scope.noProcessedCount + $scope.falsePositivesCount) * 100).toFixed(2) + '%';
                var option3 = {
                    tooltip: {
                        trigger: 'item'
                    },
                    series: [
                        {
                            name: '报警概况',
                            type: 'pie',
                            radius: ['75%', '90%'],
                            avoidLabelOverlap: false,
                            hoverAnimation: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                }
                            },
                            color: ['#22c48b', '#f1d301', '#0054a4'],
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: $scope.processedCount, name: '已处理'},
                                {value: $scope.noProcessedCount, name: '未处理'},
                                {value: $scope.falsePositivesCount, name: '误报'}
                            ]
                        }
                    ]
                };
                myChart3.setOption(option3);
                $(window).resize(function(){
                    myChart3.resize();
                });

            });

        };


        // js获取最近30天
        // var date = new Date();
        // var year = date.getFullYear() + "";
        // var month = (date.getMonth() + 1) + "";

        var begin=moment().subtract(30, 'days').format('YYYY-MM-DD');
        var end=moment().format('YYYY-MM-DD');
        // // 本月第一天日期
        // var begin = year + "-" + month + "-1";
        // // 本月最后一天日期
        // var lastDateOfCurrentMonth = new Date(year, month, 0);
        // var end = year + "-" + month + "-" + lastDateOfCurrentMonth.getDate();

        //新增设备和分组数
        $scope.getDevAndDevGroupCountByTime = function () {
            var myChart4 = echarts.init(document.getElementById("chart_panel4"));
            httpRequest.request('getDevAndDevGroupCountByTime', {
                "type": 0,
                "startTime": begin,
                "endTime": end
            }, true, 'post', function (response) {
                if (response.data.data.time !== '{}') {
                    $scope.data_time = new Array();
                    $scope.data_dev = new Array();
                    $scope.data_group = new Array();
                    for (var key in response.data.data.time) {
                        $scope.data_time.push(response.data.data.time[key]);
                        // $scope.data_dev.push(response.data.data.devCountList[response.data.data.time[key]]);
                        $scope.data_dev.push(response.data.data.devCountList[key]);
                        // $scope.data_group.push(response.data.data.devGroupCountList[response.data.data.time[key]]);
                        $scope.data_group.push(response.data.data.devGroupCountList[key]);
                    }
                }
                var option4 = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    // legend: {
                    //     right: '3%',
                    //     textStyle: {
                    //         color: '#fff'
                    //     },
                    //     data: ['设备数']
                    // },
                     color: ['#22c48b'],
                    grid: {
                        left: '6%',
                        right: '16%',
                        bottom: '12%',
                        top: '10%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            name: '时间/天',
                            type: 'category',
                            boundaryGap: false,
                            axisLine: {
                                lineStyle: {
                                    show: true,
                                    borderColor: '#fff',
                                    color: '#fff'
                                }
                            },
                            axisTick: {
                                show: true
                            },
                            axisLabel: {
                                rotate:50
                            },
                            data: $scope.data_time
                        }
                    ],
                    yAxis: [
                        {
                            name: '数量/个',
                            type: 'value',
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dotted'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    show: false,
                                    width: '0',
                                    color: '#fff'
                                }
                            },
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '设备数',
                            symbol: 'none',
                            type: 'bar',
                            barWidth: '30%',
                            data: $scope.data_dev
                        }

                    ]
                };

                $(window).resize(function(){
                    myChart4.resize();
                });
                myChart4.setOption(option4);
            });
        };
        $scope.getStatus = function (status) {
            if (status === 0) {
                return '未处理';
                // return $translate.instant(600101);
            } else if (status === 1) {
                // return $translate.instant(600102);
                return '误报';
            } else if (status === 2) {
                return '已处理';
                // return $translate.instant(600103);
            }
        };
        $scope.getAlarmHistory = function () {
            var param = {
                "offset": 0,
                "limit": 10
            };
            httpRequest.request('getAlarmHistory', param, true, 'post', function (response) {
                $scope.alarmItems = response.data.data.alarmHistorys;
                // $scope.alarmItems = '';
            })
        };

        $scope.animationsEnabled = true;
        $scope.editAlarmProcess = function (id) {
            //这里很关键,是打开模态框的过程
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,//打开时的动画开关
                templateUrl: 'editAlarmProcess.html',//模态框的页面内容,这里的url是可以自己定义的,也就意味着什么都可以写
                controller: 'EditAlarmProcessCtrl',//这是模态框的控制器,是用来控制模态框的
                size: 'md',//模态框的大小尺寸
                id: id,
                resolve: {//这是一个入参,这个很重要,它可以把主控制器中的参数传到模态框控制器中
                    id: function () {//items是一个回调函数
                        return id;//这个值会被模态框的控制器获取到
                    }
                }
            });
        };


        //获取设备分组列表
        $scope.getGroupsList = function () {
            $scope.groupItems=[];
            httpRequest.request('getDevGroups', {"id": 0,"subAccount":$scope.account}, true, 'post', function (response) {
               if(response.data.data.groupList.length>0){
                   $scope.groupItems = response.data.data.groupList;
               }
               $scope.groupItems.unshift({id:'0',title:'默认分组'})
            })
        };
        //获取指定分组里面的所有的设备
        // $scope.getDevList = function (groupId) {
        //     httpRequest.request('getDevs', {"groupId": groupId}, true, 'post', function (response) {
        //         $scope.subList = response.data.data.dev;
        //         $scope.tipShow = false;
        //         //如果groupId不为0的时候
        //         if (groupId) {
        //             $("#subList").show();
        //             $("#return").on("click", function () {
        //                 $("#subList").hide();
        //                 $scope.getDevList(0);
        //             });
        //             if ($scope.subList.length <= 0) {
        //                 $scope.tipShow = true;
        //             }
        //         }
        //         $scope.LatLngs=[];
        //         // var markers = [];
        //         //分组下有设备
        //         if(response.data.data.dev.length>0){
        //             $scope.map = new google.maps.Map(document.getElementById('allmap'), {
        //                 zoom: 4,
        //                 center: {lat: 36.676011, lng: 117.137735},
        //                 mapTypeId: google.maps.MapTypeId.ROADMAP,
        //                 zoomControl: false,
        //                 streetViewControl: false,
        //                 // zoomControlOptions: {
        //                 //     position: google.maps.ControlPosition.LEFT_TOP
        //                 // },
        //                 mapTypeControlOptions:{
        //                     mapTypeIds: []
        //                 }
        //             });
        //             $scope.map.setOptions({styles:styles[2]});
        //             $scope.markers = [];
        //             $scope.latlngbounds = new google.maps.LatLngBounds();
        //             for (var key in response.data.data.dev) {
        //                 $scope.devAlarm[response.data.data.dev[key]['devid']]=[];
        //                 var position = response.data.data.dev[key]['position'];
        //                 var devId=response.data.data.dev[key]['devid'];
        //                 if (position && position !== '-1'&&position!==',') {
        //                     if(response.data.data.dev[key]['onlineStatus']==0){
        //                         image='img/offline.png';
        //                     }else {
        //                         image='img/online.png';
        //                     }
        //                     var latLng = new google.maps.LatLng(position.split(',')[1],position.split(',')[0]);
        //                     $scope.LatLngs.push(latLng);
        //                     $scope.latlngbounds.extend(new google.maps.LatLng(position.split(',')[1],position.split(',')[0]));
        //                     var marker = new google.maps.Marker({
        //                         position: latLng,
        //                         map: $scope.map,
        //                         icon: {
        //                             url:image,
        //                             anchor:new google.maps.Point(10, 10)
        //                         },
        //                         title:response.data.data.dev[key]['name']+'('+response.data.data.dev[key]['devid']+')'
        //                     });
        //                     $scope.markers.push(marker);
        //                     $scope.addOpenEvent(devId,marker);
        //                 }
        //                 $scope.map.setCenter($scope.latlngbounds.getCenter());
        //                 $scope.map.fitBounds($scope.latlngbounds);
        //             }
        //             //点击标记缩放地图 - 绑定在google地图上的事件。
        //             // map.setCenter($scope.latlngbounds.getCenter());
        //             new MarkerClusterer($scope.map, $scope.markers, {
        //                 maxZoom: null,
        //                 gridSize: null,
        //                 styles:[{
        //                     url: 'img/m.png',
        //                     height: 40,
        //                     width: 40,
        //                     anchor: [40, 40],
        //                     textColor: '#ffffff',
        //                     textSize: 10,
        //                     iconAnchor: [20, 20]
        //                 }]
        //             });
        //             $scope.heatMap();
        //             if(response.data.data.dev[0]){
        //                 $scope.devClick(response.data.data.dev[0].devid,'list');
        //                 $scope.getDataPointInfoByDevice(response.data.data.dev[0].devid);
        //             }
        //         }
        //         //分组下无设备
        //         else{
        //
        //         }
        //
        //
        //     })
        // };
        $scope.getDevList = function (groupId) {
            $scope.map = new BMap.Map('allmap', {enableMapClick : false});
            $scope.map.addControl(new BMap.NavigationControl({type: BMAP_NAVIGATION_CONTROL_SMALL}));// 添加平移缩放控件
            $scope.map.enableInertialDragging(); // 开启惯性拖拽效果
            $scope.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            $scope.map.setMapStyle(
                {style:'midnight'}
            );
            httpRequest.request('getDevs', {"groupId": groupId}, true, 'post', function (response) {
                $scope.subList = response.data.data.dev;
                $scope.tipShow = false;
                //如果groupId不为0的时候
                if (groupId) {
                    $("#subList").show();
                    $("#return").on("click", function () {
                        $("#subList").hide();
                        $scope.getDevList(0);
                    });
                    if ($scope.subList.length <= 0) {
                        $scope.tipShow = true;
                    }
                }
                // $scope.LatLngs=[];
                // var markers = [];

                $scope.markers = [];
                var points=[];
                var position='';
                var heatMapPoints=[];
                //分组下有设备
                for(var key in response.data.data.dev){
                    $scope.devAlarm[response.data.data.dev[key]['devid']]=[];
                    position=response.data.data.dev[key]['position'];
                    if (position && position!=='-1') {
                        // var positionArry=JSON.parse("[" + response.data.data.dev[key]['position'] + ",1000]");
                        // heatMapPoints.push(positionArry);
                        if(response.data.data.dev[key]['onlineStatus']===1) {
                            var statusIco = 'img/online.png';
                        }
                        else {
                            var statusIco = 'img/offline.png';
                        }
                        var myIcon = new BMap.Icon(statusIco, new BMap.Size(20, 20),{anchor:new BMap.Size(10, 10)});
                        var devId = response.data.data.dev[key].devid;
                        var marker = new BMap.Marker(new BMap.Point(response.data.data.dev[key]['position'].split(',')[0], response.data.data.dev[key]['position'].split(',')[1]), {
                            icon: myIcon,
                            title: response.data.data.dev[key]['name']+'('+response.data.data.dev[key]['devid']+')'
                        });
                        $scope.addClickEvent(devId, marker);
                        $scope.markers.push(marker);
                        points.push(new BMap.Point(response.data.data.dev[key]['position'].split(',')[0], response.data.data.dev[key]['position'].split(',')[1]));
                        heatMapPoints.push({"lng":response.data.data.dev[key]['position'].split(',')[0], "lat":response.data.data.dev[key]['position'].split(',')[1],"count":500});
                    }
                }
                var heatMapCenter=[];
                var heatMapZoom;
                if(points.length===1){
                    heatMapCenter=[points[0].lng,points[0].lat];
                    heatMapZoom=12;
                    $scope.map.centerAndZoom(points[0], 12);
                }else if(points.length>1) {
                    var view = $scope.map.getViewport(eval(points));
                    var mapZoom = view.zoom;
                    var centerPoint = view.center;
                    heatMapCenter=[centerPoint.lng,centerPoint.lat];
                    heatMapZoom=mapZoom;
                    $scope.map.centerAndZoom(centerPoint, mapZoom);
                }else {
                    heatMapCenter=[117.143298, 36.682759];
                    heatMapZoom=10;
                    $scope.map.centerAndZoom(new BMap.Point(117.143298, 36.682759), 10);
                }
                new BMapLib.MarkerClusterer($scope.map, {markers: $scope.markers});

                if(response.data.data.dev[0]){
                    $scope.devClick(response.data.data.dev[0].devid,'list');
                    $scope.getDataPointInfoByDevice(response.data.data.dev[0].devid);
                }
                $scope.heatMap(heatMapPoints,heatMapCenter,heatMapZoom);


            })
        };
        $scope.heatMap=function (heatMapPoints,heatMapCenter,heatMapZoom) {
            // var map2 = new google.maps.Map(document.getElementById('chart_panel7'), {
            //     zoom: 4,
            //     center: {lat: 36.676011, lng: 117.137735},
            //     mapTypeId: google.maps.MapTypeId.ROADMAP,
            //     zoomControl: false,
            //     streetViewControl: false,
            //     fullscreenControl: false,
            //     // zoomControlOptions: {
            //     //     position: google.maps.ControlPosition.LEFT_TOP
            //     // },
            //     mapTypeControlOptions:{
            //         mapTypeIds: []
            //     }
            // });
            //
            // map2.setOptions({styles:styles[2]});
            //
            // new google.maps.visualization.HeatmapLayer({
            //     data: $scope.LatLngs,
            //     map: map2,
            //     maxIntensity: 10,
            //     opacity: 1,
            //     radius: 20
            // });
            // map2.setCenter($scope.latlngbounds.getCenter());
            var map2 = new BMap.Map("chart_panel7");          // 创建地图实例
            map2.setMapStyle(
                {style:'midnight'}
            );
            map2.centerAndZoom(new BMap.Point(heatMapCenter[0],heatMapCenter[1]), heatMapZoom);             // 初始化地图，设置中心点坐标和地图级别
            map2.enableScrollWheelZoom(); // 允许滚轮缩放

            var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20});
            map2.addOverlay(heatmapOverlay);
            heatmapOverlay.setDataSet({data:heatMapPoints,max:100});
        };
        // $scope.addOpenEvent=function(devId, marker) {
        //     marker.addListener("click", function () {
        //         $scope.devClick(devId);
        //         $scope.getDataPointInfoByDevice(devId);
        //     });
        // };
        $scope.addClickEvent=function(devId, marker) {
            marker.addEventListener("click", function (e) {
                $scope.devClick(devId);
                $scope.getDataPointInfoByDevice(devId);
            });
        };
        //点击分组列表
        $scope.jumpToCurrentDev=function(devId){
            $scope.devClick(devId);
            $scope.getDataPointInfoByDevice(devId);
        };

        $scope.devLastData = [];

        $scope.currentDevice;
        //查询单个设备详情
        $scope.devClick = function (devId,list) {
            httpRequest.request('getDevice', {"deviceId": devId}, true, 'post', function (response) {
                $scope.currentDevice = response.data.data;
                if(!list) {
                    if(response.data.data.device.position && response.data.data.device.position!==',') {
                        // $scope.map.setCenter(new google.maps.LatLng(response.data.data.device.position.split(',')[1], response.data.data.device.position.split(',')[0]));
                        // $scope.map.setZoom(15);
                        $scope.map.centerAndZoom(new BMap.Point(response.data.data.device.position.split(',')[0], response.data.data.device.position.split(',')[1]),15);
                    }
                }
                //数据
                $rootScope.subRcvParsedDataPointPushListAdd(devId, function (event) {
                    try {
                        if(event['devId']===$scope.devId) {
                            for (var i in event['dataPoints']) {
                                if (event['dataPoints'][i].hasOwnProperty('value')) {
                                    $scope.devLastData[event['dataPoints'][i]['slaveIndex']][event['dataPoints'][i]['pointId']]['value'] = event['dataPoints'][i]['value'];
                                } else if (event['dataPoints'][i].hasOwnProperty('values')) {
                                    if (event['dataPoints'][i]['values'].hasOwnProperty('stringValue')) {
                                        $scope.devLastData[event['dataPoints'][i]['slaveIndex']][event['dataPoints'][i]['pointId']]['value'] = event['dataPoints'][i]['values']['stringValue'];
                                    } else {
                                        $scope.devLastData[event['dataPoints'][i]['slaveIndex']][event['dataPoints'][i]['pointId']]['value'] = event['dataPoints'][i]['values']['value'];
                                    }
                                }
                            }
                        }
                    }catch(e){
                    }
                    $scope.$digest();
                });


                $scope.devInfo = response.data.data.device;
                $scope.devId = response.data.data.device.deviceId;
                $scope.onlineStatus = response.data.data.device.onlineStatus;
                //是否有组态 拼接组态链接
                $scope.getIndependentAppList();
                //获取定位轨迹
                $scope.getMapTracks($scope.devId);
                $rootScope.common_devid = response.data.data.device.deviceId;
                $scope.address = $scope.devInfo.address ? $scope.devInfo.address : '--';
                if($scope.devInfo.img && $scope.devInfo.img!==''){
                    $scope.img=$scope.devInfo.img;
                }else {
                    $scope.img='device/nopic.png';
                }
                $scope.name = $scope.devInfo.name;
                // $scope.customFields=$scope.devInfo.customFields?eval('(' + $scope.devInfo.customFields + ')'):'';
            });
        };
        //获取获取地图轨迹
        $scope.getMapTracks = function (devId) {

            httpRequest.request('getMapTracks', {'deviceIds': [devId]}, true, 'post', function (response) {

               var mapTrackdata=response.data.data;
               $scope.mapTrackBtnVisible=false;
                if(mapTrackdata.length>0){
                    $scope.mapTrackBtnVisible=true
                }else{
                    $scope.mapTrackBtnVisible=false;
                }
            }, function (response) {
            })
        }


        //获取设备数据点
        $scope.getDataPointInfoByDevice = function (devId) {
            httpRequest.request('getDataPointInfoByDevice', {'deviceIds': [devId]}, true, 'post', function (response) {
                $scope.slavesItems = response.data.data[0]['slaves'];
                var param = [];
                var dataPoints = [];
                $scope.lastData = [];
                for (var key in $scope.slavesItems) {
                    try {
                        for (var i in $scope.slavesItems[key]['iotDataDescription']) {

                            var slaveIndex = $scope.slavesItems[key]['slaveIndex'];//从机序号
                            var dataPointId = $scope.slavesItems[key]['iotDataDescription'][i]['id'];//数据点的id

                            param.push({
                                devId: devId,
                                slaveIndex: $scope.slavesItems[key]['slaveIndex'],
                                dataId: $scope.slavesItems[key]['iotDataDescription'][i]['id']
                            });
                            dataPoints.push({
                                devId: devId,
                                slaveAddr: $scope.slavesItems[key]['slaveAddr'],
                                slaveIndex: $scope.slavesItems[key]['slaveIndex'],
                                slaveName: $scope.slavesItems[key]['slaveName'],
                                iotDataDescription: $scope.slavesItems[key]['iotDataDescription'][i]
                            });

                            $scope.lastData[slaveIndex + dataPointId] = {};
                            $scope.lastData[slaveIndex + dataPointId]['value'] = '--';
                        }

                    } catch (e) {

                    }
                }
                $scope.dataPoints = dataPoints;
                $scope.getLastData(param);

            }, function (response) {

            })


        }

        $scope.getUserList=function () {
            httpRequest.request('getUsers', {subAccount: $rootScope.account}, true, 'post', function (response) {
                $scope.userList = response.data.data.users;
                $rootScope.subRcvParsedUserListAdd($rootScope.account, function (event) {
                    $scope.getAlarmHistory();
                    for (var key in $scope.subList) {
                        if ($scope.subList[key]['devid'] === event['devId'] && event.hasOwnProperty('status')) {
                            $scope.subList[key]['onlineStatus'] = event['status'];
                            if($scope.devId==event['devId']){
                                $scope.devInfo['onlineStatus']=event['status'];
                            }
                            var devIdName=$scope.subList[key]['name']+'('+$scope.subList[key]['devid']+')';
                            for(var m in $scope.markers){
                                if($scope.markers[m].getTitle()==devIdName){
                                    if(event['status']==1){
                                        $scope.markers[m].setIcon(
                                            new BMap.Icon("img/online.png",new BMap.Size(20,20)),
                                            {anchor:new BMap.Size(10, 10)}
                                        );
                                        // $scope.markers[m].setIcon({
                                        //     url:'img/online.png',
                                        //     anchor:new google.maps.Point(10, 10)
                                        // });
                                    }else {
                                        $scope.markers[m].setIcon(
                                            new BMap.Icon("img/offline.png",new BMap.Size(20,20)),
                                            {anchor:new BMap.Size(10, 10)}
                                        );
                                        // $scope.markers[m].setIcon({
                                        //     url:'img/offline.png',
                                        //     anchor:new google.maps.Point(10, 10)
                                        // });
                                    }
                                }
                            }
                        } else if ($scope.subList[key]['devid'] === event['devId'] && event.hasOwnProperty('devAlarm')) {
                            var devIdName=$scope.subList[key]['name']+'('+$scope.subList[key]['devid']+')';
                            var dataId=event['devAlarm']['pointId'];
                            $scope.devAlarm[event['devId']][event['devAlarm']['slaveIndex']+'_'+dataId]=event['devAlarm']['alarmState'];
                            var devAlarmArry=[];
                            for(var k in $scope.devAlarm[event['devId']]){
                                devAlarmArry.push($scope.devAlarm[event['devId']][k]);
                            }
                            for(var m in $scope.markers){
                                if($scope.markers[m].getTitle()==devIdName){
                                    if($.inArray('1',devAlarmArry)==-1){
                                        $scope.markers[m].setIcon(
                                            new BMap.Icon("img/online.png",new BMap.Size(20,20)),
                                            {anchor:new BMap.Size(10, 10)}
                                        );
                                        // $scope.markers[m].setIcon({
                                        //     url:'img/online.png',
                                        //     anchor:new google.maps.Point(10, 10)
                                        // });
                                        if($scope.devId==event['devId']){
                                            $scope.devInfo['onlineStatus']=1;
                                        }
                                    }else {
                                        $scope.markers[m].setIcon(
                                            new BMap.Icon("img/alarmline.png",new BMap.Size(20,20)),
                                            {anchor:new BMap.Size(10, 10)}
                                        );
                                        // $scope.markers[m].setIcon({
                                        //     url:'img/alarmline.png',
                                        //     anchor:new google.maps.Point(10, 10)
                                        // });
                                        if($scope.devId==event['devId']){
                                            $scope.devInfo['onlineStatus']=2;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    //强制更新
                    $scope.$digest();
                });
                angular.forEach($scope.userList,function (userList_data) {
                    $rootScope.subRcvParsedUserListAdd(userList_data.account, function (event) {
                        for (var key in $scope.subList) {
                            if ($scope.subList[key]['devid'] === event['devId'] && event.hasOwnProperty('status')) {
                                $scope.subList[key]['onlineStatus'] = event['status'];
                                if($scope.devId==event['devId']){
                                    $scope.devInfo['onlineStatus']=event['status'];
                                }
                                var devIdName=$scope.subList[key]['name']+'('+$scope.subList[key]['devid']+')';
                                for(var m in $scope.markers){
                                    if($scope.markers[m].getTitle()==devIdName){
                                        if(event['status']==1){
                                            $scope.markers[m].setIcon(
                                                new BMap.Icon("img/online.png",new BMap.Size(20,20)),
                                                {anchor:new BMap.Size(10, 10)}
                                            );
                                        }else {
                                            $scope.markers[m].setIcon(
                                                new BMap.Icon("img/offline.png",new BMap.Size(20,20)),
                                                {anchor:new BMap.Size(10, 10)}
                                            );
                                        }
                                    }
                                }
                            } else if ($scope.subList[key]['devid'] === event['devId'] && event.hasOwnProperty('devAlarm')) {
                                var devIdName=$scope.subList[key]['name']+'('+$scope.subList[key]['devid']+')';
                                var dataId=event['devAlarm']['pointId'];
                                $scope.devAlarm[event['devId']][event['devAlarm']['slaveIndex']+'_'+dataId]=event['devAlarm']['alarmState'];
                                var devAlarmArry=[];
                                for(var k in $scope.devAlarm[event['devId']]){
                                    devAlarmArry.push($scope.devAlarm[event['devId']][k]);
                                }
                                for(var m in $scope.markers){
                                    if($scope.markers[m].getTitle()==devIdName){
                                        if($.inArray('1',devAlarmArry)==-1){
                                            $scope.markers[m].setIcon(
                                                new BMap.Icon("img/online.png",new BMap.Size(20,20)),
                                                {anchor:new BMap.Size(10, 10)}
                                            );
                                            if($scope.devId==event['devId']){
                                                $scope.devInfo['onlineStatus']=1;
                                            }
                                        }else {
                                            $scope.markers[m].setIcon(
                                                new BMap.Icon("img/alarmline.png",new BMap.Size(20,20)),
                                                {anchor:new BMap.Size(10, 10)}
                                            );
                                            if($scope.devId==event['devId']){
                                                $scope.devInfo['onlineStatus']=2;
                                            }
                                        }
                                    }
                                }


                            }
                        }
                        //强制更新
                        $scope.$digest();
                    })
                })
            });
        };
        $timeout(function () {
            $scope.getUserList();
        },500);

        // 一开始弹窗是隐藏的
        $(function () { $('#myModal').modal('hide')});
        //修改的新值是空
        $scope.newValue='';
        $scope.param1='';
        $scope.param2='';
        $scope.param3='';


        $('#myModal').on('hide.bs.modal',
            function() {
                $scope.newValue='';
            });

        $scope.transferValue = function (devId, slaveIndex, dataId,dataName) {
            // console.log("设备id 从机id 数据点id");
            $scope.param1=devId;
            $scope.param2=slaveIndex;
            $scope.param3=dataId;
            $scope.dialogTit=dataName;
        };

        //设置数据点的新值
        $scope.sendNewValue=function(newValue){
             // console.log($scope.param1,$scope.param2,$scope.param3,newValue);
          if(newValue){
             $scope.setDataPoint($scope.param1,$scope.param2,$scope.param3,newValue)
           }else{
              bootbox.alert("未输入新的值");
          }
        };
        $scope.setDataPoint = function (devId, slaveIndex, dataId, value) {
            $rootScope.usrCloud.USR_PublishParsedSetSlaveDataPoint(devId, slaveIndex, dataId, value);
            $('#myModal').modal('hide');
        };



        //设置开关
        $scope.setDataOnOff = function (devId, slaveIndex, dataId, value) {
            bootbox.confirm({
                className: "switchoff-modal",
                message: "是否确定操作？",
                buttons: {
                    cancel: {
                        label: '<i class="fa fa-times"></i> '+'取消',
                        className: 'btn-danger'
                    },
                    confirm: {
                        label: '<i class="fa fa-check"></i> '+'确定',
                        className: 'btn-primary'
                    }
                },
                callback: function (result) {
                    if (result) {
                        if(value==1){
                            $rootScope.usrCloud.USR_PublishParsedSetSlaveDataPoint(devId, slaveIndex, dataId, 0);
                        }else if(value==0){
                            $rootScope.usrCloud.USR_PublishParsedSetSlaveDataPoint(devId, slaveIndex, dataId, 1);
                        }
                    }
                }
            });

        };




        //获取上下线图片
        $scope.getStatusImg = function (status) {
            if (status == 0) {
                return "img/offline.png";
            } else if (status == 1) {
                return "img/online.png";
            } else if (status == 2) {
                return "img/alarmline.png";
            }
        };
        $scope.getLastData = function (param) {
            httpRequest.request('getLastData', {'devDataIds': param}, true, 'post', function (response) {

                for (var key in response.data.data) {

                    try {
                        //todo:改
                        if (typeof($scope.devLastData[response.data.data[key]['slaveIndex']]) == 'undefined') {
                            $scope.devLastData[response.data.data[key]['slaveIndex']] = [];
                        }
                        if (typeof($scope.devLastData[response.data.data[key]['slaveIndex']][response.data.data[key]['dataPointId']]) == 'undefined') {
                            $scope.devLastData[response.data.data[key]['slaveIndex']][response.data.data[key]['dataPointId']] = [];
                        }
                        $scope.devLastData[response.data.data[key]['slaveIndex']][response.data.data[key]['dataPointId']]['value'] = response.data.data[key]['value'];
                    } catch (e) {
                    }
                }
            }, function (response) {
            });
        };


        //------------------拼阻态的链接----------------------
        $scope.getIndependentAppList = function () {
            $scope.independentAppListLoadFinished = false;
            var params = {
                "model": 1,
                "deviceId": $scope.devId
            };
            httpRequest.request('getConfigurations', params, true, 'post', function (response) {

                $scope.independentAppListLoadFinished = true;
                $scope.configurationItems = response.data.data.list;
                $scope.linkArry1 = [];
                console.log($scope.configurationItems);
                if (response.data.data.total > 0) {
                    angular.forEach($scope.configurationItems, function (temp_data, index) {

                        if (temp_data.hasOwnProperty('content')) {
                            var h = 0;

                            if(temp_data.compatibleType===1){
                                h = document.documentElement.clientHeight;
                            }else{
                                try{
                                    h = (JSON.parse(temp_data.content)).bg.h + 'px';
                                }catch (e) {
                                    h = document.documentElement.clientHeight;
                                    console.log(e);
                                }
                            }

                            var xyz = $scope.generateRunScadaLink(temp_data);
                            //var xyz = $scope.host + "/scada/scadaviewer.html?id=" + temp_data.id + "&link=" + temp_data.link + "&model=" + temp_data.model + "&device_id=" + $scope.devId;
                            xyz = $sce.trustAsResourceUrl(xyz);
                            $scope.linkArry1.push({h: h, link: xyz});
                        }
                    });
                }
                if ($scope.linkArry1.length > 0) {
                    $scope.independentAppData = true;

                } else {
                    $scope.independentAppData = false;
                }
            }, function (response) {
                $scope.independentAppListLoadFinished = true;
                bootbox.alert($translate.instant(response.data.status));
            })
        };

        $scope.clickSCADA = function(){
            $scope.linkArry = $scope.linkArry1;
        }
        //-----------生成运行跳转链接-----------
        /**
         *
         * @desc 生成运行的连接
         * @param templateApp 模板应用的对象
         * @param deviceId 设备ID
         * @param deviceSlaves 从机对象
         * @param onlyOne 是否只有一个从机的标记
         * @returns {string}
         */
        $scope.generateRunScadaLink = function(templateApp){

            //新版
            if(templateApp.compatibleType===1){
                if(!$scope.currentDevice){
                    return;
                }
                var deviceSlaves = $scope.currentDevice.deviceSlaves;
                if(!deviceSlaves || deviceSlaves.length < 1){
                    console.log("没有从机");
                    return "";
                }
                var onlyOne = deviceSlaves.length == 1;
                var param =  onlyOne?"&usr_slaveIndex=" + deviceSlaves[0].slaveIndex:"";
                if($scope.cur_lang=='en'){
                    param += "&lang=en";
                }
                //1、跳转链接为：/usr-draw/show.html?lightbox=1&highlight=0000ff&layers=1&nav=1&title=test&usr_id=1163&usr_link=lw12TaFGJsbZ&usr_model=0#A
                // 2、替换usr_id表示组态的id、usr_link表示组态的link、usr_model表示组态的类型（0为独立应用组态、1为模板应用组态）
                // 3、如果为模板应用组态需要额外添加几个参数，usr_devid=xxxx表示运行的哪个设备、usr_slaveIndex=xxxx表示运行设备的哪个从机。
                // 4、如果想让组态的链接在当前窗口加载使用showtarget=_self
                console.log('新版----运行');
                return $scope.host + '/usr-draw/show.html?'+'lightbox=1&highlight=0000ff&layers=1&nav=1&title=test&'+'usr_id=' + templateApp.id  + '&usr_link=' + templateApp.link + '&usr_model=' + templateApp.model + '&usr_devid=' + $scope.currentDevice.device.deviceId + param + '#A';
            }
            //旧版
            if($scope.cur_lang=='cn'){
                console.log('旧版----运行----中文');
                return $scope.host + '/scada/scadaviewer.html?id=' + templateApp.id + '&link=' + templateApp.link + '&model=' + templateApp.model;
            }

            console.log('旧版----运行----英文');
            return $scope.host + '/scada/scadaviewer_en.html?id=' + templateApp.id + '&link=' + templateApp.link + '&model=' + templateApp.model;

        };

        //------------------------------------------
        $scope.unique = function (list, name) {
            var arr = [];
            for (var i = 0; i < list.length; i++) {
                if (i == 0) arr.push(list[i]);
                var b = false;
                if (arr.length > 0 && i > 0) {
                    for (var j = 0; j < arr.length; j++) {
                        if (arr[j][name] == list[i][name]) {
                            b = true;
                            //break;
                        }
                    }
                    if (!b) {
                        arr.push(list[i]);
                    }
                }
            }
            return arr;
        }
        //获取前一个或者后一个设备
        $scope.preOrNextDev = function (devId, preNext) {
            httpRequest.request('getLastAndNextDid', {"did": devId}, true, 'post', function (response) {
                $scope.lastDid = response.data.data.lastDid;
                $scope.nextDid = response.data.data.nextDid;
                if (preNext == 'pre') {
                    $scope.devClick($scope.lastDid);
                    $scope.getDataPointInfoByDevice($scope.lastDid);
                }
                else if (preNext == 'next') {
                    $scope.devClick($scope.nextDid);
                    $scope.getDataPointInfoByDevice($scope.nextDid);
                }
            });
        };
        $scope.MaintenanceStatus = function (devId) {
            phpHttpRequest.request('getStatus', {"devId": devId}, 'post', function (response) {
                $scope.devStatus = response.data.data;
            });
        };
        $scope.getAlamHistoryCount = function (devId) {
            var myChart5 = echarts.init(document.getElementById("chart_panel5"));
            var time = Date.parse(new Date()) / 1000;
            httpRequest.request('alarmHistoryCount', {
                "did": devId,
                "type": 1,
                "timeStart": time,
                "timeEnd": time
            }, true, 'post', function (response) {
                if (response.data.data.time !== '{}') {
                    $scope.data_alarmHistoryTime = new Array();
                    $scope.data_alarmHistoryCount = new Array();
                    for (var key in response.data.data.time) {
                        $scope.data_alarmHistoryTime.push(response.data.data.time[key]);
                        $scope.data_alarmHistoryCount.push(response.data.data.alarmHistoryCountList[response.data.data.time[key]]);
                    }
                }
                var option5 = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        right: '5%',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    color: ['#22c48b'],
                    grid: {
                        top: '20%',
                        left: '4%',
                        right: '18%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            name: '时间/天',
                            axisLine: {
                                lineStyle: {
                                    color: 'white'
                                }
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            data: $scope.data_alarmHistoryTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '次数/次',
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dotted'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    show: false,
                                    width: '0',
                                    color: '#fff'
                                }
                            },
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '警情数',
                            type: 'bar',
                            barWidth: '60%',
                            data: $scope.data_alarmHistoryCount
                        }
                    ]
                };
                myChart5.setOption(option5);
            });

        };
        $scope.getMaintenanceCount = function (devId) {
            var myChart6 = echarts.init(document.getElementById("chart_panel6"));
            phpHttpRequest.request('getDays', {"devId": devId}, 'post', function (response) {
                if (response.data.data.days !== '{}') {
                    $scope.data_maintenanceTime = new Array();
                    $scope.data_maintenanceCount = new Array();
                    for (var key in response.data.data.days) {
                        $scope.data_maintenanceTime.push(response.data.data.days[key]);
                        $scope.data_maintenanceCount.push(response.data.data.countList[response.data.data.days[key]]);
                    }
                }
                var option6 = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        right: '5%',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    color: ['#22c48b'],
                    grid: {
                        top: '20%',
                        left: '4%',
                        right: '18%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            name: '时间/天',
                            axisLine: {
                                lineStyle: {
                                    color: 'white'
                                }
                            },
                            axisTick: {
                                alignWithLabel: true
                            },
                            data: $scope.data_maintenanceTime
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '次数/次',
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    type: 'dotted'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    show: false,
                                    width: '0',
                                    color: '#fff'
                                }
                            },
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series: [
                        {
                            name: '本月维保数',
                            type: 'bar',
                            barWidth: '60%',
                            data: $scope.data_maintenanceCount
                        }
                    ]
                };
                myChart6.setOption(option6);
            });

        };

    }

    //一。历史记录
    function DataHistoryPageCtrl($scope, $rootScope, $timeout, httpRequest) {

        $(function () { $('#myModal_first').modal('hide')});
        $(function () { $('#myModal_first').on('shown.bs.modal', function () {
            $scope.devIdSelected=$rootScope.common_devid;
            $scope.devName( $scope.devIdSelected);
            $scope.$digest();

        }); });


        $scope.selected = [];
        $scope.deviceDataPoints = [];
        $scope.dataHistoryList = [];
        //    $scope.cur_lang=$translate.use();
        var devPerPage = 10;
        $scope.devPage = 1;
        $scope.devTotal = 0;
        var start = moment().subtract(1, 'hours');
        var end = moment();
        $scope.devIdSelected = '';
        $scope.slaveSelected = '';
        $scope.dataPointIdSelected = '';
        $scope.lastData = {};
        $scope.getDevList = function () {
            var params = {
                "page_param": {"offset": ($scope.devPage - 1) * devPerPage, "limit": devPerPage},
                "sortByWeight": 'up',
                "search_param": $scope.devidOrName
            };
            //用于获取某分组下的设备
            httpRequest.request('getDevs', params, true, 'post', function (response) {
                $scope.devList = response.data.data.dev;
                $scope.devTotal = response.data.data.total;
                if ($scope.devTotal > 0) {
                    $scope.devIdSelected = ($rootScope.common_devid !== '') ? $rootScope.common_devid : $scope.devList[0]['devid'];

                }
                else {
                    $scope.hisLoadFinished = true;
                }
                if ($scope.devIdSelected !== '') {
                    $scope.devName($scope.devIdSelected);
                }
                // $scope.devChange();
            }, function (response) {

            });
        };
        $scope.devName = function (devid) {
            $scope.devLoadFinished = false;
            //先查询单个设备信息
            httpRequest.request('getDevice', {deviceId: devid}, true, 'post', function (response) {
                $scope.devLoadFinished = true;
                $scope.devidName = response.data.data.device.name;
                $scope.slaveList = response.data.data.deviceSlaves;
                if ($scope.slaveList.length !== 0) {
                    $scope.slaveSelected = $scope.slaveList[0].slaveIndex;
                    // $scope.slaveSelected = ($stateParams.slaveIndex!=='')?($scope.devIdSelected===$stateParams.devId?$stateParams.slaveIndex:$scope.slaveList[0].slaveIndex):$scope.slaveList[0].slaveIndex;
                }else{
                    $scope.slaveSelected=''
                }
                //设备属性
                $scope.devInfo = response.data.data.device;

                $scope.devChange();
            })
        };

        function cb(s, e) {
            // $('#reportrange span').html(s.format('YYYY/MM/DD HH:mm:ss') + ' - ' + e.format('YYYY/MM/DD HH:mm:ss'));
            $scope.test123 = s.format('YYYY/MM/DD HH:mm:ss') + ' - ' + e.format('YYYY/MM/DD HH:mm:ss');
            //history data load
            start = s;
            end = e;
            if ($scope.devIdSelected === '') {
                $scope.getDevList();
            }
            else {
                $scope.generateChart();
            }
        }

        //时间选择插件
        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            locale: {
                format: 'YYYY-MM-DD HH:mm'
            },
            timePicker: true,
            ranges: {
                '最近一小时': [moment().subtract(1, 'hours'), moment()],
                '今天': [moment().subtract((moment().unix()) % (3600 * 24) + 3600 * 8, 'seconds'), moment()]
                // '最近30天': [moment().subtract(29, 'days'), moment()]
            }
        }, cb);
        cb(start, end);

        $scope.devChange = function () {
            //查询数据点列表。设备变化，数据点列表相应变化
            httpRequest.request('getDatas', {
                'deviceId': $scope.devIdSelected,
                'slaveIndex': $scope.slaveSelected
            }, true, 'post', function (response) {
                if (response.data.hasOwnProperty('data')) {
                    if (response.data.data.hasOwnProperty('iotDataDescriptionList')) {
                        $scope.dataPointList = response.data.data.iotDataDescriptionList;
                        $scope.dataPointIdSelected = (($scope.dataPointList.length > 0) ? $scope.dataPointList[0]['id'] * 1 : '');
                        $scope.selected = [$scope.dataPointIdSelected];

                        $scope.generateChart();
                    } else {
                        $scope.dataPointIdSelected='';
                        $scope.hisLoadFinished = false;
                    }
                } else {
                    $scope.dataPointIdSelected='';
                    $scope.hisLoadFinished = false;
                }
                //$scope.dataPointChange();
            }, function (response) {
            });
            $scope.deviceDataPoints = [];
        };
        $scope.slaveChange = function () {
            $scope.devChange();
        };

        $scope.dataPointChange = function () {

        };
        $scope.previous = function () {
            if ($scope.devPage <= 1) {
                return;
            }
            $scope.devPage -= 1;
            $scope.getDevList();
        };
        $scope.next = function () {
            if ($scope.devPage >= (Math.ceil($scope.devTotal / devPerPage))) {
                return;
            }
            $scope.devPage += 1;
            $scope.getDevList();
        };

        $scope.generateChart = function () {
            $scope.deviceDataPoints = [];
            for (var i in $scope.selected) {
                $scope.deviceDataPoints.push({
                    deviceId: $scope.devIdSelected,
                    slaveIndex: $scope.slaveSelected,
                    dataPointId: $scope.selected[i]
                })
            }
            $scope.hisLoadFinished = false;
            //获取多曲线历史记录

            httpRequest.request('getMultiCurveDataPointHistory', {
                "deviceDataPoints": $scope.deviceDataPoints,
                "startTime": Date.parse(start) / 1000,
                "endTime": Date.parse(end) / 1000
            }, true, 'post', function (response) {
                $scope.hisLoadFinished = true;
                $scope.dataHistoryList = response.data.data;
                var dataLength = 0;
                if ($scope.dataHistoryList.length > 0) {
                    $scope.dataShow = true;
                    dataLength = response.data.data[0]['dataHistorys'].length;
                }
                $scope.datapoints = [];
                var pageload = [];
                //x=>name  ,y=>[time,value]
                for (var key in $scope.dataHistoryList) {
                    $scope.datapoints[key] = [];
                    for (var i in $scope.dataHistoryList[key]['dataHistorys']) {
                        $scope.datapoints[key][i] = [];
                        $scope.datapoints[key][i]['x'] = $scope.dataHistoryList[key]['dataHistorys'][i]['generateTime'] * 1000;
                        $scope.datapoints[key][i]['y'] = [$scope.dataHistoryList[key]['dataHistorys'][i]['generateTime'] * 1000, $scope.dataHistoryList[key]['dataHistorys'][i]['value']];
                        // $scope.datapoints[key][i]['alarm'] = data[key]['dataHistorys'][i]['alarm'];
                    }
                    pageload.push({
                        name: $scope.dataHistoryList[key]['dataPointName'],
                        smooth: true,
                        datapoints: $scope.datapoints[key],

                    })
                }
                // var pageload = {
                //     name: $translate.instant(500064),
                //     smooth:true,
                //     datapoints: $scope.datapoints
                // };
                //echart

                $scope.config = {
                    width: '100%',
                    height: 340,
                    grid: [{x: '4%', width: '92%'}],
                    xAxis: {
                        type: "time",
                        axisLine:{
                            lineStyle:{
                                color:'#fff',
                            }
                        }
                    },
                    yAxis: {

                        axisLine:{
                            lineStyle:{
                                color:'#fff',
                            }
                        }
                    },
                    legend:{  //图例组件

                        textStyle:{    //图例文字的样式
                            color:'#fff',
                            fontSize:12
                        }
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: ((dataLength >= 60) ? (1 - ((60 / dataLength).toFixed(4))) * 100 : '')
                        },
                        {
                            type: 'inside',
                            zoomOnMouseWheel: false
                        }
                    ]
                };
                // $scope.data = [pageload];
                $scope.multiple = pageload;
            }, function (response) {
            });
        };

        $scope.downloadHistory = function () {
            $scope.deviceDataPoints = [];
            for (var i in $scope.selected) {
                $scope.deviceDataPoints.push({
                    deviceId: $scope.devIdSelected,
                    slaveIndex: $scope.slaveSelected,
                    dataPointId: $scope.selected[i]
                })
            }
            var timer = $('#reportrange span').html();
            var timer1 = timer.split("-")[0];
            var timer2 = timer.split("-")[1];
            var tokens = JSON.parse(localStorage.getItem('usrCloud.User'));
            var params = {
                "deviceDataPoints": $scope.deviceDataPoints,
                "token": tokens.token,
                "startTime": Date.parse(timer1) / 1000,
                "endTime": Date.parse(timer2) / 1000
            };

            httpRequest.poster('downloadMultiCurveDataPointHistory', params);
        };

        $scope.getProtocol = function (protocol) {
            switch (protocol) {
                case 0:
                    return 'Modbus RTU';
                    // return $translate.instant(400003);
                    break;
                case 1:
                    return 'Modbus TCP';
                    // return $translate.instant(400004);
                    break;
                case 2:
                    return '数据透传';
                    // return $translate.instant(400005);
                    break;
                case 3:
                    return 'DL/T645-97';
                    // return $translate.instant(400006);
                    break;
                case 4:
                    return 'DL/T645-07';
                    // return $translate.instant(400007);
                    break;
            }
        };

        $scope.getPollingInterval = function (polling_interval) {
            if (typeof(polling_interval) == 'undefined') {
                return "--";
            } else if (polling_interval == -1 || polling_interval == 0) {
                // return $translate.instant(400076);
                return '不采集(设备主动上传)';
            } else if (polling_interval < 60) {
                return polling_interval + '秒';
                // return polling_interval+$translate.instant(100113);
            } else if (polling_interval < 3600) {
                return polling_interval / 60 + '分钟';
                // return polling_interval/60+$translate.instant(100114);
            } else if (polling_interval < 86400) {
                return polling_interval / 60 / 60 + '小时';
                // return polling_interval/60/60+$translate.instant(100115);
            } else {
                return polling_interval / 60 / 60 / 24 + '天';
                // return polling_interval/60/60/24+$translate.instant(100116);
            }
        };

        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {

            $scope.isSelected = function (id) {
                return $scope.selected.indexOf(id) >= 0;
            };
            $scope.selected = [$scope.dataPointIdSelected];
            var updateSelected = function (action, id) {
                if (action == 'add' && $scope.selected.indexOf(id) == -1) {
                    $scope.selected.push(id);
                }
                if (action == 'remove' && $scope.selected.indexOf(id) != -1) {
                    $scope.selected.splice($scope.selected.indexOf(id), 1);
                }
            };
            $scope.updateSelection = function ($event, id) {
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                updateSelected(action, id, checkbox.name);
            };
        });

        $(function () {
            $(".paramDiv2").on("mouseenter", function () {
                $(this).addClass("paramDiv-active");
                $(this).find(".paramHover2").show();
            }).on("mouseleave", function () {
                $(this).removeClass("paramDiv-active");
                $(this).find(".paramHover2").stop().hide();
            })
        });
        $(function () {
            $(window).on('resize', function () {
                $("#config_data").find("canvas").css("width", $("#config_data").width() - 40);

            });
        });

    }

    //二。报警记录
    /** @ngInject */
    function AlarmHistoryListPageCtrl($scope, httpRequest,$rootScope, $uibModal, $window) {


        $(function () { $('#myModal_second').modal('hide')});
        $(function () { $('#myModal_second').on('shown.bs.modal', function () {
            $scope.devIdSelected=$rootScope.common_devid;
            $scope.devName( $scope.devIdSelected);
            $scope.$digest();

        }); });

        //   $scope.cur_lang=$translate.use();
        var devPerPage = 10;
        $scope.devPage = 1;
        $scope.devTotal = 0;
        var start = moment().subtract(1, 'hours');
        var end = moment();
        $scope.devIdSelected = '';
        $scope.slaveSelected = '';
        $scope.dataPointIdSelected = '';
        $scope.dataItems = '';
        var itemsPerPage = 15;
        $scope.paginationConf = {
            itemsPerPage: itemsPerPage,
            pagesLength: 5,
            onChange: function () {
                $scope.getAlarmHistory($scope.paginationConf.currentPage);
            }
        };

        $scope.getDevList = function () {
            var params = {
                "page_param": {"offset": ($scope.devPage - 1) * devPerPage, "limit": devPerPage},
                "sortByWeight": 'up',
                "search_param": $scope.devidOrName
            };
            httpRequest.request('getDevs', params, true, 'post', function (response) {
                $scope.devList = response.data.data.dev;
                $scope.devTotal = response.data.data.total;
                if ($scope.devTotal > 0) {
                    $scope.devIdSelected = $scope.devList[0]['devid'];
                    // $scope.devIdSelected = ($stateParams.devId !== '') ? $stateParams.devId : $scope.devList[0]['devid'];
                }
                else {
                    $scope.alarmLoadFinished = true;
                }
                if ($scope.devIdSelected !== '') {
                    $scope.devName($scope.devIdSelected);
                }
                // $scope.devChange();
            }, function (response) {

            });
        };
        $scope.slaveSelected = '';
        $scope.devName = function (devid) {
            httpRequest.request('getDevice', {"deviceId": devid}, true, 'post', function (response) {
                $scope.devidName = response.data.data.device.name;
                $scope.slaveList = response.data.data.deviceSlaves;
                if ($scope.slaveList.length !== 0) {
                    $scope.slaveSelected = $scope.slaveList[0].slaveIndex;
                    // $scope.slaveSelected = ($stateParams.slaveIndex!=='')?$stateParams.slaveIndex:$scope.slaveList[0].slaveIndex;
                }else{
                    $scope.slaveSelected='';
                }
                $scope.devChange();
            })
        };

        function cb(s, e) {
            $('#reportrange2 span').html(s.format('YYYY/MM/DD HH:mm:ss') + ' - ' + e.format('YYYY/MM/DD HH:mm:ss'));
            //history data load
            start = s;
            end = e;
            if ($scope.devIdSelected === '') {
                $scope.getDevList();
            } else {
                $scope.getAlarmHistory(1);
            }
        }

        //时间选择插件
        $('#reportrange2').daterangepicker({
            startDate: start,
            endDate: end,
            locale: {
                format: 'YYYY-MM-DD HH:mm'
            },
            timePicker: true,
            ranges: {
                '最近一小时': [moment().subtract(1, 'hours'), moment()],
                '今天': [moment().subtract((moment().unix()) % (3600 * 24) + 3600 * 8, 'seconds'), moment()],
                '最近30天': [moment().subtract(29, 'days'), moment()]
            }
        }, cb);


        cb(start, end);

        $scope.devChange = function () {
            // $scope.devName($scope.devIdSelected);
            httpRequest.request('getDatas', {
                'deviceId': $scope.devIdSelected,
                'slaveIndex': $scope.slaveSelected
            }, true, 'post', function (response) {
                if (response.data.data.hasOwnProperty('iotDataDescriptionList')) {
                    $scope.dataPointList = response.data.data.iotDataDescriptionList;

                        $scope.dataPointIdSelected = ($scope.dataPointList.length > 0) ? $scope.dataPointList[0]['id'].toString() : '';
                        // $scope.dataPointIdSelected = ($scope.dataPointList.length > 0) ? (($stateParams.dataId === $scope.dataPointList[0]['id']) ? $stateParams.dataId.toString() : $scope.dataPointList[0]['id'].toString()) : '';

                }else{
                    $scope.dataPointIdSelected ='';
                }

                //$scope.dataPointIdSelected = ($stateParams.dataId!=='')?$stateParams.dataId.toString():(($scope.dataPointList.length!==0)?$scope.dataPointList[0]['id'].toString():'');
                $scope.dataPointChange();
            }, function (response) {
            })
        };

        $scope.slaveChange = function () {
            $scope.devChange();
        };

        $scope.dataPointChange = function () {
            $scope.getAlarmHistory(1);
        };

        $scope.previous = function () {
            if ($scope.devPage <= 1) {
                return;
            }
            $scope.devPage -= 1;
            $scope.getDevList();
        };
        $scope.next = function () {
            if ($scope.devPage >= (Math.ceil($scope.devTotal / devPerPage))) {
                return;
            }
            $scope.devPage += 1;
            $scope.getDevList();
        };


        $scope.getAlarmHistory = function (currentPage) {
            $scope.alarmLoadFinished = false;
            var param = {
                "offset": (currentPage - 1) * itemsPerPage,
                "limit": itemsPerPage,
                "did": $scope.devIdSelected,
                "slaveIndex": $scope.slaveSelected,
                "dataId": $scope.dataPointIdSelected,
                // "alarmState":'',
                "timeStart": Date.parse(start) / 1000,
                "timeEnd": Date.parse(end) / 1000
            };
            httpRequest.request('getAlarmHistory', param, true, 'post', function (response) {
                $scope.alarmLoadFinished = true;
                $scope.paginationConf.totalItems = response.data.data.total;
                $scope.alarmItems = response.data.data.alarmHistorys;
            }, function (response) {
                $scope.alarmLoadFinished = true;
                console.log(response.data.info);
                // bootbox.alert($translate.instant(response.data.status));
            })
        };
        $scope.downloadAlarm = function () {
            var tokens = JSON.parse(localStorage.getItem('usrCloud.User'));
            var params = {
                "did": $scope.devIdSelected,
                "slaveIndex": $scope.slaveSelected,
                "dataId": $scope.dataPointIdSelected,
                "timeStart": Date.parse(start) / 1000,
                "timeEnd": Date.parse(end) / 1000,
                "token": tokens.token
            };
            httpRequest.poster('downloadAlarmHistoryData', params);
        };
        $scope.getStatus = function (status) {
            if (status === 0) {
                return '未处理';
                // return $translate.instant(600101);
            } else if (status === 1) {
                // return $translate.instant(600102);
                return '误报';
            } else if (status === 2) {
                return '已处理';
                // return $translate.instant(600103);
            }
        };

        $scope.animationsEnabled = true;
        $scope.previewAlarmProcess = function (id) {
            //这里很关键,是打开模态框的过程
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,//打开时的动画开关
                templateUrl: 'previewAlarmProcess.html',//模态框的页面内容,这里的url是可以自己定义的,也就意味着什么都可以写
                controller: 'PreviewAlarmProcessCtrl',//这是模态框的控制器,是用来控制模态框的
                size: 'md',//模态框的大小尺寸
                id: id,
                resolve: {//这是一个入参,这个很重要,它可以把主控制器中的参数传到模态框控制器中
                    id: function () {//items是一个回调函数
                        return id;//这个值会被模态框的控制器获取到
                    }
                }
            });
        };
        $scope.editAlarmProcess = function (id) {
            //这里很关键,是打开模态框的过程
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,//打开时的动画开关
                templateUrl: 'editAlarmProcess.html',//模态框的页面内容,这里的url是可以自己定义的,也就意味着什么都可以写
                controller: 'EditAlarmProcessCtrl',//这是模态框的控制器,是用来控制模态框的
                size: 'md',//模态框的大小尺寸
                id: id,
                resolve: {//这是一个入参,这个很重要,它可以把主控制器中的参数传到模态框控制器中
                    id: function () {//items是一个回调函数
                        return id;//这个值会被模态框的控制器获取到
                    }
                }
            });
        };

    }


    //四。定位轨迹
    function DeviceMapTrackPageCtrl($scope, $rootScope, httpRequest, $location, $timeout) {
        $(function () { $('#myModal_forth').modal('hide')});
        $scope.selected=[];
        $(function () { $('#myModal_forth').on('shown.bs.modal', function () {
            $scope.selected=[$rootScope.common_devid];
            $scope.getMapTracks();
            // $scope.devName( $scope.devIdSelected);
           $scope.$digest();

        }); });







        // $scope.selected=[$rootScope.common_devid];
        // $scope.cur_lang=$translate.use();
        $scope.lngLats=[];
        var start = moment().subtract(1, 'days');
        var end = moment();
        $('#allmap4').css('height',$(window).height()-242+'px');

        //获取数据点列表
        var itemsPerPage = 7;
        $scope.paginationConf = {
            itemsPerPage: itemsPerPage,
            pagesLength: 5,
            onChange: function () {
                $scope.getDevList($scope.paginationConf.currentPage);
            }
        };
        $scope.getDevList = function (currentPage) {
            var params={
                "page_param": {"offset": (currentPage-1)*itemsPerPage, "limit": itemsPerPage},
                "sortByWeight":'up',
                "search_param": $scope.devidOrName
            };
            httpRequest.request('getDevs',params,true,'post',function (response) {
                $scope.devItems = response.data.data.dev;
                if(response.data.data.total>0){
                    $scope.selected=$scope.selected.length===0?[$scope.devItems[0].devid]:$scope.selected;
                }
                $scope.paginationConf.totalItems = response.data.data.total;
            })
        };

        $scope.$on('ngRepeatFinished', function( ngRepeatFinishedEvent ) {
            $scope.isSelected = function(id){
                return $scope.selected.indexOf(id) >= 0;
            };
            $scope.selected = $scope.selected;
            var updateSelected = function(action,id,name){
                if(action == 'add' && $scope.selected.indexOf(id) == -1){
                    $scope.selected.push(id);

                }
                if(action == 'remove' && $scope.selected.indexOf(id)!=-1){
                    var idx = $scope.selected.indexOf(id);
                    $scope.selected.splice(idx,1);
                }
            };
            $scope.updateSelection = function($event, id){
                var checkbox = $event.target;
                var action = (checkbox.checked ? 'add' : 'remove');
                updateSelected(action, id + "", checkbox.name);
            }

        });



        function cb(s, e) {
            $('#reportrange4 span').html(s.format('YYYY/MM/DD HH:mm:ss') + ' - ' + e.format('YYYY/MM/DD HH:mm:ss'));
            start = s;
            end = e;
        }

        //时间选择插件
        // if($scope.cur_lang=='cn') {
            $('#reportrange4').daterangepicker({
                startDate: start,
                endDate: end,
                locale: {
                    format: 'YYYY-MM-DD HH:mm'
                },
                timePicker: true,
                ranges: {
                    '最近30天': [moment().subtract(29, 'days'), moment()],
                    '最近一小时': [moment().subtract(1, 'hours'), moment()],
                    '今天': [moment().subtract((moment().unix()) % (3600 * 24) + 3600 * 8, 'seconds'), moment()]
                }
            }, cb);
        // }
        // else {
        //     $('#reportrange4').daterangepicker({
        //         startDate: start,
        //         endDate: end,
        //         locale: {
        //             format: 'YYYY-MM-DD HH:mm'
        //         },
        //         timePicker: true,
        //         ranges: {
        //             'The last hour': [moment().subtract(1, 'hours'), moment()],
        //             'Today': [moment().subtract((moment().unix()) % (3600 * 24) + 3600 * 8, 'seconds'), moment()]
        //         }
        //     }, cb);
        // }
        cb(start, end);
        //根据毫秒获取时间
        $scope.getTime = function (time, format) {
            var date = new Date(time);
            if (format === undefined) {
                format = date;
                date = new Date();
            }
            var map = {
                "y": date.getFullYear(),//年
                "M": date.getMonth() + 1, //月份
                "d": date.getDate(), //日
                "h": date.getHours(), //小时
                "m": date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(), //分
                "s": date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(), //秒
                "q": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
                var v = map[t];
                if (v !== undefined) {
                    if (all.length > 1) {
                        v = '0' + v;
                        v = v.substr(v.length - 2);
                    }
                    return v;
                }
                return all;
            });
            return format;
        };

        $scope.getMapTracks=function () {
            if ($scope.selected.length>11) {
                bootbox.alert('设备最多选择10个！');
                return;
            }
            var params={
                deviceIds:$scope.selected,
                startDate:Date.parse(start),
                dataType:0,
                endDate:Date.parse(end)
            };
            httpRequest.request('getMapTracks',params,true,'post',function (response) {
                if(response.data.data.length!==0) {
                    $scope.tracks = response.data.data;
                    for(var i in $scope.tracks){
                        $scope.lngLats[i]=[];
                        for(var j in $scope.tracks[i]['tracks']) {
                            if(!((-0.1<$scope.tracks[i]['tracks'][j].lng && $scope.tracks[i]['tracks'][j].lng<0.1) && (-0.1<$scope.tracks[i]['tracks'][j].lat && $scope.tracks[i]['tracks'][j].lat<0.1))) {
                                $scope.lngLats[i].push({
                                    devName: $scope.tracks[i]['deviceName'],
                                    lng: $scope.tracks[i]['tracks'][j].lng,
                                    lat: $scope.tracks[i]['tracks'][j].lat,
                                    createTime: $scope.tracks[i]['tracks'][j].createTime,
                                    locationType: $scope.tracks[i]['tracks'][j].locationType
                                });
                            }
                            // $scope.lngLats[i].push({
                            //     devName:$scope.tracks[i]['deviceName'],
                            //     lng: $scope.tracks[i]['tracks'][j].lng,
                            //     lat: $scope.tracks[i]['tracks'][j].lat,
                            //     createTime: $scope.tracks[i]['tracks'][j].createTime
                            // });
                        }
                    }
                } else {
                    $scope.tracks=[];
                    $scope.lngLats=[];
                }
                $scope.setMapTrack();
            });
        };
        $timeout(function () {
            $scope.getMapTracks();
        },500);
        $scope.setMapTrack=function () {
            $timeout(function () {
                var color=['#18a45b','#0054a4','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
                //
                // //-----------地图颜色-------------
                // var image = 'img/map.png';
                // var colorSys = {
                //     blue : "#2064ed",
                //     blueLight : "#6fb0de",
                //     blueDark : "#3f5a7b",
                //     green : "#22c48b",
                //     greenLight : "#1be4a0",
                //     orange : "#f18901",
                //     yellow : "#f1d301"
                // };
                // var styles=[];
                // styles.push([//亮色
                //     {
                //         stylers: [
                //             // {color:"#0093ff"},
                //             // {saturation:-40},//饱和度
                //             //{lightness:-20},亮度
                //             // {gamma:.6},
                //             // {invert_lightness:true},
                //             // {weight:.4}
                //         ]
                //     },
                //     {
                //         featureType:"landscape",
                //         stylers: [
                //             // {hue:colorSys.red},
                //             {lightness:40}
                //         ]
                //     }
                //     ,{//设置道路线条
                //         featureType: "road",
                //         //elementType: "geometry",
                //         stylers: [
                //             {lightness:20},
                //             {visibility:"simplified"}
                //         ]
                //     },
                //     {
                //         featureType:"water",
                //         stylers:[
                //             {hue:colorSys.blue},
                //             {lightness:-20},
                //             {saturation:-40}
                //         ]
                //     }
                //     // ,{//不显示道路名称
                //     // 	featureType: "road",
                //     // 	elementType: "labels",
                //     // 	stylers: [
                //     // 		{visibility:"off"}
                //     // 	]
                //     // }
                // ]);
                // styles.push([//暗色
                //     {
                //         stylers: [
                //             //{color:"#0093ff"},
                //             {saturation:-40},//饱和度
                //             //{lightness:-20},亮度
                //             {gamma:.6},
                //             {invert_lightness:true},
                //             {hue:"#0093ff"},
                //             {weight:.4}
                //         ]
                //     }
                //     ,{//设置道路线条
                //         featureType: "road",
                //         //elementType: "geometry",
                //         stylers: [
                //             {lightness:-20},
                //             {visibility:"simplified"}
                //         ]
                //     }
                //     // ,{//不显示道路名称
                //     // 	featureType: "road",
                //     // 	elementType: "labels",
                //     // 	stylers: [
                //     // 		{visibility:"off"}
                //     // 	]
                //     // }
                // ]);
                // styles.push([//暗色
                //     {
                //         stylers: [
                //             //{color:"#0093ff"},
                //             {saturation:-20},//饱和度
                //             //{lightness:-20},亮度
                //             {gamma:.6},
                //             {invert_lightness:true},
                //             {hue:"#0093ff"},
                //             {weight:.4}
                //         ]
                //     },
                //     {
                //         featureType:"landscape",
                //         stylers: [
                //             {hue:colorSys.blue},
                //             {lightness:-40},
                //             {saturation:50}
                //         ]
                //     }
                //     ,{//设置道路线条
                //         featureType: "road",
                //         //elementType: "geometry",
                //         stylers: [
                //             {hue:colorSys.blue},
                //             {lightness:-70},
                //             {saturation:60}
                //         ]
                //     },
                //     {
                //         featureType:"water",
                //         stylers:[
                //             {hue:colorSys.blue},
                //             {lightness:-30},
                //             {saturation: -20}
                //         ]
                //     }
                //     // ,{//不显示道路名称
                //     // 	featureType: "road",
                //     // 	elementType: "labels",
                //     // 	stylers: [
                //     // 		{visibility:"off"}
                //     // 	]
                //     // }
                // ]);
                //--------------------------------



                // var allmap4 = new google.maps.Map(document.getElementById('allmap4'), {
                //     zoom: 4,
                //     center: {lat: 36.676011, lng: 117.137735},
                //     mapTypeId: 'terrain'
                // });
                // allmap4.setOptions({styles:styles[2]});
                // var markers = [];
                // var latlngbounds = new google.maps.LatLngBounds();
                // if($scope.lngLats.length>0){
                //     for(var i in $scope.lngLats){
                //         for(var j in $scope.lngLats[i]) {
                //             var latLng = new google.maps.LatLng($scope.lngLats[i][j].lat, $scope.lngLats[i][j].lng);
                //             var marker = new google.maps.Marker({
                //                 position: latLng,
                //                 map: allmap4,
                //                 icon: {
                //                     url:'img/map.png',
                //                     anchor:new google.maps.Point(10, 10)
                //                 },
                //                 title: '设备：' + $scope.lngLats[i][j].devName + '\r\n' + '时间：' + $scope.getTime($scope.lngLats[i][j].createTime, 'y-M-d h:m:s')
                //             });
                //             markers.push(marker);
                //             latlngbounds.extend(latLng);
                //         }
                //     }
                //
                //     allmap4.setCenter(latlngbounds.getCenter());
                //     allmap4.fitBounds(latlngbounds);
                // }
                // if($scope.lngLats.length>0) {
                //     var m = 0;
                //     for(var i in $scope.lngLats) {
                //         var flightPlanCoordinates = $scope.lngLats[i];
                //         var lineSymbol = {
                //             path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                //             scale: 1,
                //             strokeColor: '#fff',
                //             strokeOpacity: 1,
                //             strokeWeight: 2
                //         };
                //         var flightPath = new google.maps.Polyline({
                //             path: flightPlanCoordinates,
                //             geodesic: true,
                //             icons: [
                //                 {
                //                     icon: lineSymbol,
                //                     offset: '10px',
                //                     repeat: '30px'
                //                 }
                //             ],
                //             strokeColor: color[m],
                //             strokeOpacity: 1.0,
                //             strokeWeight: 10
                //         });
                //         flightPath.setMap(allmap4);
                //         m++;
                //     }
                // }
                // new MarkerClusterer(allmap4, markers, {
                //     maxZoom: null,
                //     gridSize: null,
                //     styles:[{
                //         url: 'img/m.png',
                //         height: 40,
                //         width: 40,
                //         anchor: [40, 40],
                //         textColor: '#ffffff',
                //         textSize: 10,
                //         iconAnchor: [20, 20]
                //     }]
                // });
                var allmap = new BMap.Map("allmap4");// 创建Map实例
                allmap.setMapStyle(
                    {style:'midnight'}
                );
                allmap.addControl(new BMap.NavigationControl()); //添加标准地图控件(左上角的放大缩小左右拖拽控件)
                allmap.addControl(new BMap.MapTypeControl()); //添加地图类型控件
                // 百度地图API功能
                var pois = [];
                var markers = [];
                var poisLngLats=[];
                if($scope.lngLats.length>0){
                    for(var i in $scope.lngLats){
                        pois[i]=[];
                        for(var j in $scope.lngLats[i]) {
                            var marker = new BMap.Marker(new BMap.Point($scope.lngLats[i][j].lng, $scope.lngLats[i][j].lat), {
                                title: '设备：' + $scope.lngLats[i][j].devName + '\r\n' + '时间：' + $scope.getTime($scope.lngLats[i][j].createTime, 'y-M-d h:m:s')
                            });
                            markers.push(marker);
                            if(j>0){
                                if(!($scope.lngLats[i][j].lng==$scope.lngLats[i][j-1].lng && $scope.lngLats[i][j].lat==$scope.lngLats[i][j-1].lat)){
                                    pois[i].push(new BMap.Point($scope.lngLats[i][j].lng, $scope.lngLats[i][j].lat));
                                }
                            } else {
                                pois[i].push(new BMap.Point($scope.lngLats[i][j].lng, $scope.lngLats[i][j].lat));
                            }
                            poisLngLats.push(new BMap.Point($scope.lngLats[i][j].lng, $scope.lngLats[i][j].lat));
                        }

                    }
                }

                if (poisLngLats.length === 1) {
                    allmap.centerAndZoom(poisLngLats[0], 12);
                } else if (poisLngLats.length > 1) {
                    var view = allmap.getViewport(eval(poisLngLats));
                    var mapZoom = view.zoom;
                    var centerPoint = view.center;
                    allmap.centerAndZoom(centerPoint, mapZoom);
                } else {
                    allmap.centerAndZoom(new BMap.Point(117.143298, 36.682759), 10);
                }
                allmap.enableScrollWheelZoom(true);//开启鼠标滚轮缩放

                new BMapLib.MarkerClusterer(allmap, {markers: markers});
                var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
                    scale: 0.6,//图标缩放大小
                    strokeColor:'#fff',//设置矢量图标的线填充颜色
                    strokeWeight: '2',//设置线宽
                });
                if(pois.length>0){
                    var m=0;
                    for(var i in pois) {
                        var icons = new BMap.IconSequence(sy, '10', '30');
                        // 创建polyline对象
                        var polyline = new BMap.Polyline(pois[i], {
                            enableEditing: false,//是否启用线编辑，默认为false
                            enableClicking: true,//是否响应点击事件，默认为true
                            icons: [icons],
                            strokeWeight: '8',//折线的宽度，以像素为单位
                            strokeOpacity: 0.8,//折线的透明度，取值范围0 - 1
                            strokeColor: color[m] //折线颜色
                        });
                        allmap.addOverlay(polyline);//增加折线
                        m++;
                    }
                }
            },20)

        };
    }
    //------------------------------------------


    function PreviewAlarmProcessCtrl($scope, $uibModalInstance, id, httpRequest) {
        httpRequest.request('getAlarmInfo', {hid: id}, true, 'post', function (response) {
            $scope.status = response.data.data.status;
            $scope.description = response.data.data.description;
            $scope.processTime = response.data.data.processTime;
        }, function (response) {
            bootbox.alert(response.data.status);
            // bootbox.alert($translate.instant(response.data.status));
        });
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.getStatus = function (status) {
            if (status === 0) {
                return '未处理';
                // return $translate.instant(600101);
            } else if (status === 1) {
                return '误报';
                // return $translate.instant(600102);
            } else if (status === 2) {
                return '已处理';
                // return $translate.instant(600103);
            }
        };
    }

    function EditAlarmProcessCtrl($scope, $uibModalInstance, id, httpRequest, $window) {
        httpRequest.request('getAlarmInfo', {hid: id}, true, 'post', function (response) {
            $scope.status = response.data.data.status.toString();
            $scope.description = response.data.data.description;
            $scope.time = response.data.data.time;
        }, function (response) {
            bootbox.alert(response.data.status);
            // bootbox.alert($translate.instant(response.data.status));
        });
        $scope.editAlarmResult = function () {
            var params = {
                "hid": id,
                "status": $scope.status,
                "description": $scope.description
            };
            $scope.loading = true;
            httpRequest.request('editAlarmInfo', params, true, 'post', function (response) {
                $scope.loading = false;
                bootbox.alert('处理成功', function () {
                    $window.location.reload();
                });
                // bootbox.alert($translate.instant(900143),function(){
                //     $window.location.reload();
                // });
            }, function (response) {
                $scope.loading = false;
                bootbox.alert(response.data.status);
                // bootbox.alert($translate.instant(response.data.status));
            })
        };
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }


})();

function getDevList(event) {
    var groupId = event.getAttribute("data-id");

    var appElement = document.querySelector('[ng-controller=fireSolutionCtrl]');
    var $scope = angular.element(appElement).scope();
    $scope.getDevList(groupId);
}
