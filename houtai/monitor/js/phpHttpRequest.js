(function () {
    'use strict';

    angular.module('usrCloud')
        .service('phpHttpRequest', function ($rootScope, localStorageService, $window,$http) {
            $rootScope.phpCloudUrl='https://cloudapi.usr.cn/phpApi';
            var apiAssign = {
                'getOneMaintenance':'maintenance/Maintenance/getOne',//获取维保记录信息
                'getListMaintenance':'maintenance/Maintenance/getList',//获取维保记录列表
                'getOneCycle':'maintenance/Cycle/getOne',//获取维保记录信息
                'getDays':'maintenance/Maintenance/getDays',//获取维保记录数
                'getStatus':'maintenance/Maintenance/getStatus'//获取设备维保状态
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
                request: function (name, param, method,successCallback, failedCallback) {
                    var params={};
                    params = param;
                    localStorageService.setPrefix('usrCloud.');
                    var token = localStorageService.get('User').token;
                    params["token"]=token;
                    $http({
                        method: method,
                        url: $rootScope.phpCloudUrl + '/' + apiAssign[name],
                        data: params,
                        headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
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
                }

            }
        });
})();