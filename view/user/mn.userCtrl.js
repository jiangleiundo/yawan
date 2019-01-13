var UserCtrl = {
    scope: null,

    userModel: {
        modelArr: [],
        selectAll: false,
        isShowInfo: false, //是否显示info
        idx: null, //修改在数组中位置
        keywords: null, //搜索关键字
        curId: null, //当前点击用户ID
        name: null, //用户备注
        note: null //用户备注
    },

    init: function($scope){
        this.scope = $scope;

        this.scope.userModel = this.userModel;

        this.getUserList("");

        this.onEvent();
    },

    getUserList: function(keywords){
        var self = this,
            params = {
                userType: 1,
                likeStr: keywords
            };

        pageController.pageInit(self.scope, api.API_GET_USER_LIST, params,

            /**
             * 用户列表
             * @param data.count
             * @param data.userList
             * @param data.userList.telephone 用户手机
             * @param data.userList.registerTime 注册时间
             * @param data.userList.balance 账户余额
             */
            function(data){
                if(self.scope.page.selectPageNum)
                {
                    var totalPage = Math.ceil(data.count / self.scope.page.selectPageNum);
                    pageController.pageNum(totalPage);
                }

                self.userModel.modelArr = data.userList;
                self.userModel.isShowInfo = false;
                self.scope.$apply();
            }
        );
    },

    // 绑定事件
    onEvent: function(){
        var self = this;

        self.scope.searchUser = function(){
            self.getUserList(self.userModel.keywords);
        };

        self.scope.checkInfo = function(){ //查看详情
            self.userModel.isShowInfo = true;
        };

        self.scope.back2UserList = function(){ //返回列表
            self.userModel.isShowInfo = false;
        }

    }
};