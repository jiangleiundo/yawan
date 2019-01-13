var BiddingSingleCtrl = {
    scope: null,

    biddingModel: {
        modelArr: [],
        biddingID: null, //当前竞拍ID
        selNum: null, //分页数
        nowPage: null, //当前页
        totalPage: null, //总页数
        inputPage: null //跳转页
    },

    init: function($scope){
        this.scope = $scope;

        this.biddingModel.biddingID = _utility.getQueryString("biddingID");
        this.biddingModel.selNum = _utility.getQueryString("selNum");
        this.biddingModel.nowPage = _utility.getQueryString("nowPage");
        this.biddingModel.totalPage = _utility.getQueryString("totalPage");
        this.biddingModel.inputPage = _utility.getQueryString("inputPage");

        this.scope.biddingModel = this.biddingModel;

        this.getBiddingList();

        this.onEvent();
    },

    getBiddingList: function(){
        var self = this,
            params = {
                userId: self.biddingModel.biddingID
            };

        pageController.pageInit(self.scope, api.API_GET_SINGLE_BIDDING_LIST, params,

            /**
             * 竞拍列表
             * @param data.count 计数
             * @param data.biddingList 列表数据
             * @param data.biddingList.itemName 用户数据
             * @param data.biddingList.nowPrice 当前价格
             * @param data.biddingList.createTime 竞拍时间
             */
            function(data){
                if(self.scope.page.selectPageNum)
                {
                    var totalPage = Math.ceil(data.count / self.scope.page.selectPageNum);
                    pageController.pageNum(totalPage);
                }

                self.biddingModel.modelArr = data.biddingList;
                self.scope.$apply();
            }
        )
    },

    onEvent: function(){
        var self = this;

        self.scope.back2userList = function(){
            location.href = JUMP_URL.USER_LIST + "?selNum=" + self.biddingModel.selNum
                            + "&nowPage=" + self.biddingModel.nowPage
                            + "&totalPage=" + self.biddingModel.totalPage
                            + "&inputPage=" + self.biddingModel.inputPage;
        }
    }
};