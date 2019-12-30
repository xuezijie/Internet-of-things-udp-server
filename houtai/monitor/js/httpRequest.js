(function () {
    'use strict';

    angular.module('usrCloud')
        .service('httpRequest', function ($rootScope, localStorageService, $window,$http) {
            $rootScope.cloudUrl = apiUrl;
            var randomWord = "",
                range = 8,
                arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            for(var i=0; i<range; i++){
                var pos = Math.round(Math.random() * (arr.length-1));
                randomWord += arr[pos];
            }
            $rootScope.randomWord = randomWord;
            var apiAssign = {

                'getConfigurations':'configuration/getConfigurations',//拼接阻态的链接
                'downloadMultiCurveDataPointHistory':'download/downloadMultiCurveDataPointHistory',//获取多条数据点历史记录
                'getDevAndDevGroupCount':'dev/getDevAndDevGroupCount',//查询设备总数
                'getDevAndDevGroupCountByTime':'dev/getDevAndDevGroupCountByTime',//查询新增设备和分组数
                'getAlarmHistory':'trigger/getAlarmHistory',//获取报警历史记录
                'alarmHistoryCount':'trigger/alarmHistoryCount',//报警记录统计
                'getAlarmHistoryStatusCount':'trigger/getAlarmHistoryStatusCount',//获取报警状态统计
                'getDevGroups':'dev/getDevGroups',//查询设备分组列表
                'getDevs':'dev/getDevs',//查询设备列表
                'getDevice':'dev/getDevice',//查询单个设备信息
                'getLastAndNextDid':'dev/getLastAndNextDid',//根据当前设备获取上一个和下一个设备信息
                'getMultiCurveDataPointHistory':'datadic/getMultiCurveDataPointHistory',//获取多条历史数据
                'regUser2':'user/regUser2',//添加子用户
                'deleteUsers':'user/deleteUsers',//删除子用户
                'getUser':'user/getUser',//查询用户信息
                'editUser':'user/editUser',//修改用户信息
                'modifyPassword':'user/modifyPassword',//修改用户密码
                'getComPass':'dev/getComPass',//获取通讯密码
                'editComPass':'dev/editComPass',//修改通讯密码
                'getLastAddDevIdAndDefPass':'dev/getLastAddDevIdAndDefPass',//获取用户默认通讯密码和默认设备编号
                'addDevGroup':'dev/addDevGroup',//添加设备分组
                'deleteDevGroups':'dev/deleteDevGroups',//删除设备分组
                'getDevGroup':'dev/getDevGroup',//查询单个设备分组
                'editDevGroup':'dev/editDevGroup',//修改设备分组
                'addDev':'dev/addDev',//添加单个设备
                'addDevs':'dev/addDevs',//批量添加设备
                'deleteDevs':'dev/deleteDevs',//删除设备
                'editDev':'dev/editDev',//修改设备
                'getGroups':'group/getGroups',//查询透传组列表
                'getDevByGroupId':'group/getDevByGroupId',//查询透传组信息
                'addGroup':'group/addGroup',//添加透传组
                'deleteGroup':'group/deleteGroup',//删除透传组
                'editGroup':'group/editGroup',//编辑透传组
                'getDatas':'datadic/getDatas',//查询数据点列表
                'getData':'datadic/getData',//查询数据点信息
                'addDatadic':'datadic/addDatadic',//添加数据点
                'editDatadic':'datadic/editDatadic',//修改数据点
                'deleteDatas':'datadic/deleteDatas',//删除数据点
                'getTriggers':'trigger/getTriggers',//查询触发器列表
                'getTrigger':'trigger/getTrigger',//查询触发器信息
                'addTrigger':'trigger/addTrigger',//添加触发器
                'editTrigger':'trigger/editTrigger',//修改触发器
                'deleteTriggers':'trigger/deleteTriggers',//删除触发器
                'getDataPointInfoByDevice':'datadic/getDataPointInfoByDevice',
                'getLastData':'datadic/getLastData',
                'getDataHisByTimePeriod':'datadic/getDataHisByTimePeriod',
                'getDataPointInfo':'datadic/getDataPointInfo',
                'getOnlineCountByUid':'dev/getOnlineCountByUid',//获取在线数量,
                'getProtocolCountByUid':'dev/getProtocolCountByUid',//获取协议数量
                'getDevCountByUid':'dev/getDevCountByUid',//获取用户下设备
                'getAlarmInfo':'trigger/getAlarmInfo',//获取报警历史记录处理信息
                'editAlarmInfo':'trigger/editAlarmInfo',//编辑报警历史记录处理信息
                'addTaskQueue':'taskqueue/addTaskQueue',//添加操作记录
                'updataTaskQueue':'taskqueue/updataTaskQueue',//修改操作记录
                'getTaskQueueById':'taskqueue/getTaskQueueById',//查询单个操作记录
                'getTaskQueueListByDid':'taskqueue/getTaskQueueListByDid',//查询操作记录列表
                'deleteTaskQueue':'taskqueue/deleteTaskQueue',//删除操作记录
                'getDevsByType':'dev/getDevsByType',//删除操作记录
                'createProject':'project/createProject' ,//系統管理添加
                'getProject':'project/getProject',//不登录获取公司信息中性功能
                'editProject':'project/editProject',//编辑系统管理
                'getOnlineHistory':'dev/getOnlineHistory',// 获取上下线记录
                'downloadAlarmHistoryData':'download/downloadAlarmHistoryData',//获取历史报警记录
                'downloadDataHistoryData':'download/downloadDataHistoryData',//获取数据点历史记录
                'getDataPointTemplateList':'template/getDataPointTemplateList',//获取数据点模版列表
                'getDataPointsByTemplate':'template/getDataPointsByTemplate',//获取数据点模版对应数据点
                'getDataPointTemplateById':'template/getDataPointTemplateById',//查询数据点模版信息
                'deleteDataPointTemplate':'template/deleteDataPointTemplate',//删除数据点模版
                'updateDataPointTemplate':'template/updateDataPointTemplate',//修改数据点模版
                'addDataPointTemplate':'template/addDataPointTemplate',//添加数据点模版
                'addEmailTemplate':'neutral/addEmailTemplate',//添加邮件模版
                'updateEmailTemplateById':'neutral/updateEmailTemplateById',//修改邮件模版
                'getEmailTemplateByuid':'neutral/getEmailTemplateByuid',//获取邮件模板
                'deleteEmailTemplate':'neutral/deleteEmailTemplate',//删除邮件模板
                'getWeChatPublicMsgByUid':'neutral/getWeChatPublicMsgByUid',//获取微信公众号信息
                'addWeChatPublicMsg':'neutral/addWeChatPublicMsg',//添加微信公众号信息
                'updateWeChatPublicMsg':'neutral/updateWeChatPublicMsg',//修改微信公众号信息
                'deleteWeChatPublicMsg':'neutral/deleteWeChatPublicMsg',//修改微信公众号信息
                'customDataPointSortPosition':'datadic/customDataPointSortPosition',//修改数据点自定义排序的位置
                'customDevSortPosition':'dev/customDevSortPosition',//修改设备自定义排序位置
                'getUsers':'user/getUsers',//查询子用户列表
                'getMapTracks':'dev/getMapTracks',//获取地图轨迹

            };
            return {
                /**
                 * http 接口
                 * @param url
                 * @param param
                 * @param sign
                 * @param method
                 * @param successCallback
                 * @param failedCallback
                 */
                request: function (name, param, sign, method,successCallback, failedCallback) {
                    var payload = {};
                    payload.iat = (new Date(new Date())) / 1000;
                    payload.exp = payload.iat + 60 * 60 * 2;
                    payload.nonce = $rootScope.randomWord;
                    payload.paramJson = JSON.stringify(param);
                    var sClaim = JSON.stringify(payload);
                    var pHeader = {'alg': 'HS256', 'typ': 'JWT'};
                    var sHeader = JSON.stringify(pHeader);
                    localStorageService.setPrefix('usrCloud.');
                    var key = localStorageService.get('User').signCode;
                    var sJWS = KJUR.jws.JWS.sign(null, sHeader, sClaim, key);
                    var token = localStorageService.get('User').token;
                    $http({
                        method: method,
                        url: $rootScope.cloudUrl + '/' + apiAssign[name],
                        data: {token: token, sign: sJWS},
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                            'AppId': 'po246089zkljagiusdgq'
                        },
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj) {
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            }
                            return str.join("&");
                        }
                    }).then(function callback(response) {
                        if (response.data.status === 0) {
                            successCallback(response);
                        }else if (response.data.status ===4010||response.data.status ===4011||response.data.status ===4012||response.data.status ===4014){
                            $window.location.href='/';
                        }else {
                            failedCallback(response);
                        }
                    });
                },
                poster:function(name,params){
                    $http({
                        url:  $rootScope.cloudUrl + '/' + apiAssign[name],
                        method: "post",
                        data: params,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                        },
                        responseType: 'arraybuffer'
                    }).success(function (data) {

                        var blob = new Blob([data], {type: "application/vnd.ms-excel"});
                        var objectUrl = URL.createObjectURL(blob);
                        var a = document.createElement('a');
                        document.body.appendChild(a);
                        a.href = objectUrl;
                        a.target = '_blank';
                        a.click();
                        a.remove();
                    }).error(function (data, status, headers, config) {

                    });
                },

                http:function(name,params, successCallback,failedCallback){
                    $http({
                        url:  $rootScope.cloudUrl + '/' + apiAssign[name],
                        method: "post",
                        data: params,
                        headers: {
                            'Content-Type':  'application/x-www-form-urlencoded;charset=UTF-8'
                        }
                    }).success(function (response) {
                        successCallback(response);
                    }).error(function (response) {
                        failedCallback(response);
                    })
                }

            }
        });
})();
