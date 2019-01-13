/*ajax请求*/
var $data = {

    /**
     * 网络底层
     * @param {Object} type "post"or"get"
     * @param {Object} api api地址URL
     * @param {Object} params 参数
     * @param {Object} callback 回调
     * @param {Object} onFail 失败
     * @param {Object} sync 是否同步
     */
    httpRequest : function(type, api, params, callback, sync, onFail){

        var phpSessionId = localStorage.getItem(strKey.K_PHP_SESSION_ID);
        if(!_utility.isEmpty(phpSessionId))
        {
            api = api + '?sid=' + phpSessionId;
        }

        var async = true;
        if(sync != undefined)
        {
            async = !sync;
        }

        $.ajax({
            url: api,
            async: async,
            type: type,
            data: params,
            dataType: 'json',

            /**
             *
             * @param data
             * @param data.err 错误类型
             * @param data.errMsg 错误信息
             */
            success: function(data)
            {
                var err = data.err,
                    errMsg = data.errMsg;

                if(err != errCode.success)
                {
                    if(errMsg != '')
                    {
                        alert(errMsg);
                    }

                    if(err == errCode.tokenFail)
                    {
                        location.href = "login.html";
                    }

                    if(!_utility.isEmpty(onFail))
                    {
                        onFail(err);
                    }
                }
                else
                {
                    callback(data.data);
                }
            },
            error: function() {
                alert("请求数据失败");
            }
        });
    }
};