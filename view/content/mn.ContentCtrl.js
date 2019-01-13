var ContentCtrl = {
    scope: null,

    contentModel: {
        adminNum: null,
        userNum: null,
        adminName: null,
        adminID: null,
        adminType: null,
        newPwd: null,
        newPwd2: null
    },

    init: function($scope){
        this.scope = $scope;

        this.scope.contentModel = this.contentModel;

        this.getData();

        this.onEvent();
    },

    reFresh: function(){
        var self = this;

        self.contentModel.newPwd = null;
        self.contentModel.newPwd2 = null;
    },

    getData: function(){
        var self = this,
            userInfo = JSON.parse(localStorage.getItem(strKey.K_USER_INFO));

        self.contentModel.adminName = userInfo.platformId;
        self.contentModel.adminID = userInfo.userId;
        if(_utility.isEmpty(userInfo.entries))
        {
            self.contentModel.adminType = CN_TIPS.SUPER_ADMIN;
        }
        else
        {
            self.contentModel.adminType = CN_TIPS.COMMON_ADMIN;
        }

        //用户统计
        $data.httpRequest("post", api.API_GET_USER_STATISTICS, {}, function(data){

            var arr = data;
            for(var i = 0; i < arr.length; i++)
            {
                if(arr[i].userType == 1)
                {
                    self.contentModel.userNum = arr[i].count;
                }
                if(arr[i].userType == 2)
                {
                    self.contentModel.adminNum = arr[i].count;
                }
            }
            self.scope.$apply();
        })
    },

    onEvent: function(){
        var self = this;

        // 修改密码
        self.scope.modPassword = function(){
            self.reFresh();

            layer.open({
                type: 1,
                skin: 'layer-ex-skin',
                title: '修改密码',
                area: ['400px', '230px'],
                btn: ['确定', '取消'],
                content: $('#layerBox'),
                yes: function(){
                    self.mod();
                }
            })
        };
    },

    mod: function(){
        var self = this;

        var params = {
            userId: self.contentModel.adminID,
            password: self.contentModel.newPwd2
        };

        if(self.checkParams())
        {
            $data.httpRequest("post", api.API_MOD_ADMIN_PWD, params, function(){
                layer.closeAll();
                layer.msg(CN_TIPS.MOD_OK, {time: 1800, anim: 5});
            })
        }
    },

    checkParams: function(){
        var self = this;

        if(_utility.isEmpty(self.contentModel.newPwd))
        {
            layer.msg(CN_TIPS.NEW_PWD_BLANK, {time: 1500, anim: 1});
            return false;
        }
        if(self.contentModel.newPwd != self.contentModel.newPwd2)
        {
            layer.msg(CN_TIPS.DIFF_PWD, {time: 1500, anim: 1});
            return false;
        }

        return true;
    }
};