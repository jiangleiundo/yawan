//工具类方法
var _utility = {

    //解析时间戳
    formatDate : function(timestamp, onlyDate)
    {
        var date = new Date(timestamp * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        if (onlyDate)
        {
            return this.numberPrefix(4, year) + "-" + this.numberPrefix(2, month) + "-" + this.numberPrefix(2, day);
        }

        return this.numberPrefix(4, year) + "-" + this.numberPrefix(2, month) + "-" + this.numberPrefix(2, day) + " "
            + this.numberPrefix(2, hour) + ":" + this.numberPrefix(2, minute) + ":" + this.numberPrefix(2, second);
    },

    numberPrefix : function (size, num)
    {
        var sLen = ('' + num).length;
        if (sLen >= size)
        {
            return '' + num;
        }
        var preZero = (new Array(size)).join('0');

        return preZero.substring(0, size - sLen) + num;
    },

    //解析URL传参
    getQueryString : function(name)
    {
        var after = window.location.hash.split("?")[1];
        if(after)
        {
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = after.match(reg);
            if(r != null)
            {
                return  decodeURIComponent(r[2]);
            }
            else
            {
                return null;
            }
        }
    },

    // 对象深拷贝
    // todo: 要判断是不是会嵌套，需要判断嵌套层级
    objDeepCopy : function(source) {
        var result = {};
        for (var key in source)
        {
            if(source.hasOwnProperty(key))
            {
                result[key] = (typeof source[key]==='object') ? this.objDeepCopy(source[key]) : source[key];
            }
        }
        return result;
    },

    //判断是否为空
    isEmpty : function(strVal){
        var isEmpty = false;

        try{
            if(strVal == "" || strVal == "''" || strVal == '' || strVal == "null" || strVal == "{}" || strVal == "undefined"
                || strVal == "[]" || strVal == null || strVal == "'[]'" || strVal == "<null>" || strVal == undefined || strVal == 0 || strVal == "0")
            {
                isEmpty = true;
            }
            else
            {
                isEmpty = false;
            }
        }
        catch(e) {
            isEmpty = true;
        }

        return isEmpty;
    }
};