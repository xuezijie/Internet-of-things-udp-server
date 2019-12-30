(function () {
    'use strict';

    angular.module('usrCloud')
        .service('mqttService', function ($rootScope,httpRequest, $timeout,localStorageService) {
            localStorageService.setPrefix('usrCloud.');
            $rootScope.account = localStorageService.get('User').account;
            $rootScope.upass = localStorageService.get('UserP').pmd;
            /* =========================================================== */
            /*                     注册事件                         */
            /* =========================================================== */

            //连接确认
            function USR_onConnAck(event) {
                //连接成功
                if (event.code === 0) {
                    $rootScope.mqttConnected = true;
                    while (typeof($rootScope.connCallbackList) !== 'undefined' && $rootScope.connCallbackList.length > 0) {
                        $rootScope.connCallbackList.pop()();
                    }
                } else {
                    $rootScope.mqttConnected = false;
                    //连接失败
                    $timeout(function () {
                        $rootScope.usrCloud.USR_Connect($rootScope.account, $rootScope.upass);
                        console.log(event.message);
                    },500);
                    //alert(event.message);
                }
            }

            //连接断开
            function USR_onConnLost(event) {
                $rootScope.mqttConnected = false;
            }

            //订阅确认
            function USR_onSubAck(event) {
                //订阅成功，添加已订阅的主题
            }

            //取消订阅确认
            function USR_onUnSubAck(event) {
                //取消订阅成功
                if (event.code === 0) {

                } else {

                }
            }

            //收到数据
            function USR_onRcvParsedDataPointPush(event) {
                //观察者模式 下发
                for (var key in $rootScope.onRcvParsedDataPointPushList) {
                    if (key === event['devId'])
                        $rootScope.onRcvParsedDataPointPushList[key](event);
                }
            }
            //coap返回状态
            function USR_onRcvParsedOptionResponseReturn(event) {

                //观察者模式 下发
                for (var key in $rootScope.onRcvParsedOptionResponseResultList) {
                    if (key === event['devId'])
                        $rootScope.onRcvParsedOptionResponseResultList[key](event);
                }
            }

            //上下线推送
            function USR_onRcvParsedDevStatusPush(event) {
                //下发
                for (var key in $rootScope.onRcvParsedDevStatusPushList) {
                    $rootScope.onRcvParsedDevStatusPushList[key](event);
                }
            }

            function USR_onRcvParsedDevAlarmPush(event){
                //下发
                for (var key in $rootScope.onRcvParsedDevAlarmPushList) {
                    $rootScope.onRcvParsedDevAlarmPushList[key](event);
                }
            }
            //设备原始数据接收
            function USR_onRcvRawFromDev(event) {
                //下发
                for (var key in $rootScope.onRcvRawFromDevList) {
                    $rootScope.onRcvRawFromDevList[key](event);
                }
            }

            return {
                //初始化
                init: function () {
                    if (typeof($rootScope.account) === 'undefined') {
                        return;
                    }
                    if (typeof($rootScope.mqttConnected) === 'undefined' || $rootScope.mqttConnected === false) {
                        $rootScope.mqttConnected = true;
                        $rootScope.usrCloud = new UsrCloud();
                        var callback = {
                            USR_onConnAck: USR_onConnAck,
                            USR_onConnLost: USR_onConnLost,
                            USR_onSubAck: USR_onSubAck,
                            USR_onUnSubAck: USR_onUnSubAck,
                            USR_onRcvParsedDataPointPush: USR_onRcvParsedDataPointPush,
                            USR_onRcvParsedOptionResponseReturn: USR_onRcvParsedOptionResponseReturn,
                            USR_onRcvParsedDevStatusPush: USR_onRcvParsedDevStatusPush,
                            USR_onRcvRawFromDev:USR_onRcvRawFromDev,
                            USR_onRcvParsedDevAlarmPush:USR_onRcvParsedDevAlarmPush
                        };
                        $rootScope.usrCloud.Usr_Init(websocketUrl, 443, 2, callback);
                        $rootScope.usrCloud.USR_Connect($rootScope.account, $rootScope.upass);
                    }

                    if (typeof($rootScope.mqttInitFlag) === 'undefined') {
                        $rootScope.mqttInitFlag = false;
                    }
                    //初始化连接成功执行函数列表
                    $rootScope.connCallbackList = [];
                    //接收设备解析后数据执行函数列表
                    $rootScope.onRcvParsedDataPointPushList = [];
                    $rootScope.onRcvParsedOptionResponseResultList = [];
                    //设备上下线观察者列表
                    $rootScope.onRcvParsedDevStatusPushList = [];
                    $rootScope.onRcvParsedDevAlarmPushList=[];
                    //设备原始数据接收观察者列表
                    $rootScope.onRcvRawFromDevList = [];
                    //账户原始数据接收函数
                    $rootScope.RcvUserRawListAdd = function (username, rcvFun) {
                        //订阅 获取返回值
                        var subResult = $rootScope.usrCloud.USR_SubscribeUserRaw(username);
                        if (subResult === 0) {
                        } else if (subResult === 1) {
                            //未连接 ,连接后触发
                            $rootScope.connCallbackList.push(function () {
                                $rootScope.usrCloud.USR_SubscribeUserRaw(username);
                            });
                        }
                        // $rootScope.onRcvRawFromDevList[devId] = rcvFun;
                        $rootScope.onRcvRawFromDevList.push(rcvFun);
                    };
                    //设备原始数据接收函数
                    $rootScope.RcvDevRawListAdd = function (devId, rcvFun) {
                        //订阅 获取返回值
                        var subResult = $rootScope.usrCloud.USR_SubscribeDevRaw(devId);
                        if (subResult === 0) {
                        } else if (subResult === 1) {
                            //未连接 ,连接后触发
                            $rootScope.connCallbackList.push(function () {
                                $rootScope.usrCloud.USR_SubscribeDevRaw(devId);
                            });
                        }
                        $rootScope.onRcvRawFromDevList[devId] = rcvFun;
                    };
                    //添加设备解析后数据订阅和接收函数
                    $rootScope.subRcvParsedDataPointPushListAdd = function (devId, rcvFun) {
                        //订阅 获取返回值
                        var subResult = $rootScope.usrCloud.USR_SubscribeDevParsed(devId);
                        if (subResult === 0) {
                        } else if (subResult === 1) {
                            //未连接 ,连接后触发
                            $rootScope.connCallbackList.push(function () {
                                $rootScope.usrCloud.USR_SubscribeDevParsed(devId);
                            });
                        }
                        $rootScope.onRcvParsedDataPointPushList[devId] = rcvFun;
                        $rootScope.onRcvParsedOptionResponseResultList[devId] = rcvFun;
                    };
                    //添加 解析数据回调函数
                    $rootScope.subRcvParsedUserListAdd = function (username, rcvFun) {
                        var subResult = $rootScope.usrCloud.USR_SubscribeUserParsed(username);
                        if (subResult === 0) {
                        } else if (subResult === 1) {
                            $rootScope.connCallbackList.push(function () {
                                $rootScope.usrCloud.USR_SubscribeUserParsed(username);
                            });
                        }
                        $rootScope.onRcvParsedDevStatusPushList.push(rcvFun);
                        $rootScope.onRcvParsedDevAlarmPushList.push(rcvFun);

                    };


                    //取消所有已订阅主题
                    $rootScope.usrCloud.USR_UnSubScribeAll();
                    $timeout(function () {
                        //全局上下线和报警
                      /*  var scope={};
                        httpRequest.request('getUsers',{subAccount:$rootScope.account},true,'post',function (response) {
                            scope.userList=response.data.data.users;
                            scope.accounts=[$rootScope.account];
                            angular.forEach(scope.userList,function (userList_data,index) {

                                if(scope.userList.length===0){
                                    scope.accounts=scope.accounts;
                                }
                                else {
                                    scope.accounts.push(userList_data.account);
                                }
                            });
                            angular.forEach(scope.accounts,function (accounts_data) {
                                $rootScope.subRcvParsedUserListAdd(accounts_data, function (event) {
                                    if (event['account']!==accounts_data){
                                        return;
                                    }
                                    var statusString = "";
                                    //httpRequest.request('getDev',{devid:event.devId},true,'post',function (res) {
                                    if (event.hasOwnProperty('status')) {
                                        if (event['status'] === 0) {
                                            statusString = '状态'+'：'+'下线';
                                            toastr.warning('设备名称'+'：' + event['devName'] + '<br/>'+'设备ID'+'：' +event['devId'], statusString, {
                                                "autoDismiss": false,
                                                "positionClass": "toast-top-right",
                                                "type": "warning",
                                                "timeOut": "5000",
                                                "extendedTimeOut": "2000",
                                                "allowHtml": true,
                                                "closeButton": false,
                                                "tapToDismiss": true,
                                                "progressBar": false,
                                                "newestOnTop": true,
                                                "maxOpened": 0,
                                                "preventDuplicates": false,
                                                "preventOpenDuplicates": false
                                            })
                                        } else {
                                            statusString = '状态'+'：'+'上线';
                                            toastr.info('设备名称'+'：' + event['devName'] + '<br/>'+'设备ID'+'：' +event['devId'], statusString, {
                                                "autoDismiss": false,
                                                "positionClass": "toast-top-right",
                                                "type": "info",
                                                "timeOut": "5000",
                                                "extendedTimeOut": "2000",
                                                "allowHtml": true,
                                                "closeButton": false,
                                                "tapToDismiss": true,
                                                "progressBar": false,
                                                "newestOnTop": true,
                                                "maxOpened": 0,
                                                "preventDuplicates": false,
                                                "preventOpenDuplicates": false
                                            })
                                        }
                                    } else if (event.hasOwnProperty('devAlarm')) {
                                        if(event['devAlarm']['alarmState']==='1') {
                                            statusString ='设备名称'+'：' + event['devAlarm']['devName'] + '<br/>'+'设备ID'+'：' + event['devId'] + '<br/>'+'数据点名称'+'：' + event['devAlarm']['dataName'] + '<br/>'+'数值'+'：' + event['devAlarm']['value'];
                                            toastr.error('<a href="' + appConfig.host + '/main.html#/device/deviceDatail/' + event['devId'] + '" target="_blank">' + statusString + '</a>', '', {
                                                "autoDismiss": false,
                                                "positionClass": "toast-top-right",
                                                "type": "error",
                                                "timeOut": "5000",
                                                "extendedTimeOut": "2000",
                                                "allowHtml": true,
                                                "closeButton": true,
                                                "tapToDismiss": false,
                                                "progressBar": false,
                                                "newestOnTop": true,
                                                "maxOpened": 0,
                                                "preventDuplicates": false,
                                                "preventOpenDuplicates": false
                                            })
                                        }else if(event['devAlarm']['alarmState']==='0') {
                                            statusString = '报警恢复正常'+'<br/>'+'设备名称'+'：' + event['devAlarm']['devName'] + '<br/>'+'设备ID'+'：' + event['devId'] + '<br/>'+'数据点名称'+'：' + event['devAlarm']['dataName'] + '<br/>'+'数值'+'：' + event['devAlarm']['value'];
                                            toastr.error('<a href="' + appConfig.host + '/main.html#/device/deviceDatail/' + event['devId'] + '" target="_blank">' + statusString + '</a>', '', {
                                                "autoDismiss": false,
                                                "positionClass": "toast-top-right",
                                                "type": "info",
                                                "timeOut": "5000",
                                                "extendedTimeOut": "2000",
                                                "allowHtml": true,
                                                "closeButton": true,
                                                "tapToDismiss": false,
                                                "progressBar": false,
                                                "newestOnTop": true,
                                                "maxOpened": 0,
                                                "preventDuplicates": false,
                                                "preventOpenDuplicates": false
                                            })
                                        }
                                    }
                                    //     },
                                    //     function () {
                                    // });
                                });
                            })
                            //$scope.didPass($rootScope.account);
                        },function () {
                        })

*/
                    },10)
                }
            }
        });
})();