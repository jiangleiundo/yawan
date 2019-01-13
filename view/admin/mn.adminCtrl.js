var AdminCtrl = {
    scope: null,

    adminModel: {
        modelArr: [],
        selectAll: false,
        pwdLayerIdx: null, //修改密码层
        modelLayerIdx: null, //修改&添加管理员层
        curId: null, //当前ID
        modalInput: null, //用户名
        modalInput2: null, //密码
        title: null,      //modal标题
        isAdd: true,      //是否添加
        isSuper: true,    //是否是超级管理员
        permissions: null //权限
    },

    init: function($scope){
        this.scope = $scope;

        this.scope.adminModel = this.adminModel;

        this.getAdminList();

        this.onEvent();
    },

    reFresh: function(){
        var self = this;

        self.adminModel.modalInput = null;
        self.adminModel.modalInput2 = null;
        self.permissionArray = [];
    },

    getAdminList: function(){
        var self = this;

        pageController.pageInit(self.scope, api.API_GET_ADMIN_LIST, {},
            /**
             * 管理员列表
             * @param data
             * @param data.totalNum
             * @param data.adminList 用户列表
             * @param data.adminList.lastLoginTime 最近登录
             * @param data.adminList.name 昵称
             * @param data.adminList.accountId 用户名
             */
            function(data){
                if(self.scope.page.selectPageNum)
                {
                    var pageNum = Math.ceil(data.totalNum / self.scope.page.selectPageNum);
                    pageController.pageNum(pageNum);
                }

                self.adminModel.modelArr = data.adminList;

                for(var i = 0, len = self.adminModel.modelArr.length; i < len; i++)
                {
                    self.adminModel.modelArr[i].selected = false;
                    if(_utility.isEmpty(self.adminModel.modelArr[i].entries))
                    {
                        self.adminModel.modelArr[i].super = true;
                    }
                }

                self.scope.$apply();
            }
        )
    },

    onEvent: function(){
        var self = this;

        //修改密码
        self.scope.modPwd = function(item){
            self.reFresh();
            self.adminModel.curId = item.userId;
            self.adminModel.modalInput = item.accountId;

            layer.open({
                type: 1,
                skin: 'layer-ex-skin',
                title: '修改密码',
                area: ['400px', '230px'],
                btn: ['确定', '取消'],
                content: $('#layerBox'),
                yes: function(index){
                    self.adminModel.pwdLayerIdx = index;
                    self.modAdminPwd();
                }
            })
        };

        //管理员类型
        self.scope.selAdminType = function(type){
            self.adminModel.isSuper = type == 0;
        };

        //设置权限
        self.scope.selRight = function(permission){
            permission.selected = !permission.selected;
        };

        //添加管理员
        self.scope.addAdmins = function(){
            self.addAdminShow();
        };

        //修改管理员
        self.scope.mod = function(item){
            self.modAdminShow(item);
        };

        //提交添加或者修改管理员
        //self.scope.submit3 = function(){
        //    if(self.adminModel.isAdd) {
        //        self.addAdmin();
        //    }
        //    else {
        //        self.modAdmin();
        //    }
        //};

        //全选
        self.scope.allSel = function(){
            commonFn.switchSelAll(self.adminModel);
        };

        //单选
        self.scope.oneSel = function(curID){
            commonFn.switchSelOne(curID, self.adminModel, 'userId');
        };

        //删除
        self.scope.delAdmin = function(){
            self.delAdmins();
        }
    },

    layerShow: function(title){
        var self = this;
        layer.open({
            type: 1,
            skin: 'layer-ex-skin',
            title: title,
            area: '600px',
            btn: ['确定', '取消'],
            content: $('#layerBox2'),
            yes: function(index){
                self.adminModel.modelLayerIdx = index;
                if(self.adminModel.isAdd)
                {
                    self.addAdmin();
                }
                else
                {
                    self.modAdmin();
                }
            }
        })
    },

    //添加管理员
    addAdmin: function(){
        var self = this,
            params = {
                platformId: self.adminModel.modalInput,
                password: self.adminModel.modalInput2,
                adminType: self.adminModel.isSuper? '0': '1'
            };

        if(self.adminModel.isSuper)
        {
            params.pageEntries = '[]'
        }
        else
        {
            params.pageEntries = JSON.stringify(self.checkPermissions())
        }

        if(self.checkParams(params))
        {
            $data.httpRequest("post", api.API_ADD_ADMIN, params, function(){
                self.getAdminList();

                layer.close(self.adminModel.modelLayerIdx);
                layer.msg(CN_TIPS.ADD_OK, {time: 1600, anim: 5});
            })
        }
    },

    //修改管理员
    modAdmin: function(){
        var self = this;

        var params = {
                userId: self.adminModel.curID
            },
            modInfo = {
                adminType: self.adminModel.isSuper? '0': '1'
            };

        params.modInfo = JSON.stringify(modInfo);
        params.pageEntries = JSON.stringify(self.checkPermissions());

        $data.httpRequest("post", api.API_MOD_ADMIN, params, function(){

            pageController.reFreshCurPage();

            layer.close(self.adminModel.modelLayerIdx);
            layer.msg(CN_TIPS.MOD_OK, {time: 1600, anim: 5});
        });
    },

    //添加管理员modal
    addAdminShow: function(){
        var self = this;

        self.layerShow(CN_TIPS.ADD_ADMIN);
        self.adminModel.isAdd = true;
        self.reFresh();

        self.adminModel.permissions = commonFn.getAdminPermissions();

        for (var i in self.adminModel.permissions)
        {
            if(self.adminModel.permissions.hasOwnProperty(i))
            {
                var p = self.adminModel.permissions[i];
                for (var j in p.secPermission)
                {
                    if(p.secPermission.hasOwnProperty(j))
                    {
                        p.secPermission[j].selected = !(p.id == 1); //普通管理员不显示管理员列表
                    }
                }
            }
        }
    },

    /**
     * 修改管理员modal
     * @param item.accountId 用户名
     * @param item.userId 用户ID
     * @param item.entries 权限数组
     * @param item.entries.entryId 权限ID
     */
    modAdminShow: function(item){
        var self = this;

        self.layerShow(CN_TIPS.MOD_ADMIN);
        self.adminModel.isAdd = false;
        self.reFresh();

        self.adminModel.modalInput = item.accountId;
        self.adminModel.isSuper = _utility.isEmpty(item.entries);
        self.adminModel.curID = item.userId;

        self.adminModel.permissions = commonFn.getAdminPermissions();

        var entryIds = [];

        for(var i in item.entries)
        {
            if(item.entries.hasOwnProperty(i))
            {
                var e = item.entries[i];

                entryIds.push(e.entryId);

                for(var j in e.children) {
                    if(e.children.hasOwnProperty(j))
                    {
                        entryIds.push(e.children[j].entryId);
                    }
                }
            }
        }

        for (var k in self.adminModel.permissions) {
            if(self.adminModel.permissions.hasOwnProperty(k))
            {
                var p = self.adminModel.permissions[k];
                for (var m in p.secPermission) {
                    if(p.secPermission.hasOwnProperty(m))
                    {
                        p.secPermission[m].selected = entryIds.indexOf(p.secPermission[m].id) != -1;
                    }
                }
            }
        }
    },

    //删除管理员
    delAdmins: function(){
        var self = this,
            ids = commonFn.findSelIds(self.adminModel, 'userId');

        if(!_utility.isEmpty(ids))
        {
            commonFn.delListByIds(ids, 'userIds', api.API_DEL_ADMIN, function(){

                layer.msg(CN_TIPS.DEL_OK, {time: 1600, anim:5});
                if(self.adminModel.selectAll)
                {
                    self.getAdminList();
                    self.adminModel.selectAll = false;
                }
                else
                {
                    pageController.reFreshCurPage();
                }
            })
        }
    },

    //修改密码
    modAdminPwd: function(){
        var self = this,
            params = {
                userId: self.adminModel.curId,
                password: self.adminModel.modalInput2
            };

        if(_utility.isEmpty(params.password))
        {
            layer.msg(CN_TIPS.PWD_BLANK, {time: 1600, anim: 1});
        }
        else
        {
            $data.httpRequest("post", api.API_MOD_ADMIN_PWD, params, function(){
                layer.close(self.adminModel.pwdLayerIdx);
                pageController.reFreshCurPage();
                layer.msg(CN_TIPS.MOD_OK, {time: 1600, anim: 5});
            })
        }
    },

    //检测权限
    checkPermissions: function(){
        var self = this,
            pageEntries = [],
            adminPermissions = self.adminModel.permissions;

        for(var i in adminPermissions)
        {
            if(adminPermissions.hasOwnProperty(i))
            {
                var p = adminPermissions[i],
                    hasSel = false; //是否有二级权限被选中

                for(var j in p.secPermission)
                {
                    if(p.secPermission.hasOwnProperty(j))
                    {
                        if(p.secPermission[j].selected)
                        {
                            pageEntries.push(p.secPermission[j].id);
                            hasSel = true;
                        }
                    }
                }

                if(hasSel)
                {
                    pageEntries.push(p.id);
                }
            }
        }

        return pageEntries;
    },

    //检测参数
    checkParams: function(params) {

        if(_utility.isEmpty(params.platformId))
        {
            layer.msg(CN_TIPS.USER_NAME_BLANK, {time: 1600, anim: 5});
            return false;
        }
        if(_utility.isEmpty(params.password))
        {
            layer.msg(CN_TIPS.PWD_BLANK, {time: 1600, anim: 5});
            return false;
        }

        return true;
    }

};