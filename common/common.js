var commonFn = {
    //删除
    delListByIds : function(delids, delKey, api, delCallback){
        var params = {};
        params[delKey] = delids;
        $data.httpRequest("post", api, params, delCallback);
    },

    //找到当前选中项的ids
    findSelIds : function(curObj, idKey, tips){
        var delArr = [];

        for(var i = 0; i< curObj.modelArr.length; i++){
            if(curObj.modelArr[i].selected)
            {
                delArr.push(curObj.modelArr[i][idKey]);
            }
        }
        if (delArr.length == 0)
        {
            if(tips == undefined)
            {
                tips = "请先勾选要操作的选项";
            }
            layer.msg(tips, {time: 1600, anim: 5});
            return null;
        }
        else
        {
            return JSON.stringify(delArr);
        }
    },

    //找到当前obj
    finderCurObj : function(curId, arr, idKey){
        for(var i = 0; i < arr.length; i++ )
        {
            if(curId == arr[i][idKey])
            {
                return arr[i];
            }
        }
        return null;
    },

    //切换单选状态
    switchSelOne : function(curId, curObj, idKey){
        var self = this;
        var curItem =  self.finderCurObj(curId, curObj.modelArr, idKey);
        if(curItem == null)
        {
            return;
        }
        curItem.selected = !curItem.selected;

        self.checkSelAll(curObj);
    },

    //判断是否全部选中
    checkSelAll : function(curObj){
        var isAllSel = true;
        for(var i = 0; i < curObj.modelArr.length; i++ )
        {
            if(!curObj.modelArr[i].selected)
            {
                isAllSel = false;
                break;
            }
        }
        curObj.selectAll = isAllSel;
    },

    //切换全选状态
    switchSelAll : function(curObj){
        var selected = !curObj.selectAll;
        curObj.selectAll = selected;
        for(var i = 0; i < curObj.modelArr.length; i++)
        {
            curObj.modelArr[i].selected = selected;
        }
    },

    //获取管理权限
    getAdminPermissions : function()
    {
        return _utility.objDeepCopy(permissionArr);
    }
};