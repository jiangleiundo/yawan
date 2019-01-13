var AuctionCtrl = {
    scope: null,

    auctionModel: {
        modelArr: [],
        selectAll: false,
        allGoodsArr: [], //所有藏品数组名称和ID
        selNum: null, //分页数
        nowPage: null, //当前页
        totalPage: null, //总页数
        inputPage: null, //跳转页

        modalTitle: null, //modal标题
        goodsName: null, //藏品名称
        startTime: "", //开始时间
        endTime: "", //结束时间
        initPrice: 0, //初始价格
        lowPrice: null, //最低加价
        referencePrice: 0, //参考价
        marginPrice: 0, //保证金

        keyWords: null, //搜索藏品关键字
        startIndex: 0, //从第几页搜索
        curGoodsID: null, //当前选中藏品ID
        curID: null, //要修改的竞拍藏品ID
        isAdd: false, //是否是添加
        isShowInfo: false //是否显示详情页
    },

    init: function($scope){
        this.scope = $scope;

        this.auctionModel.selNum = _utility.getQueryString("selNum");
        this.auctionModel.nowPage = _utility.getQueryString("nowPage");
        this.auctionModel.totalPage = _utility.getQueryString("totalPage");
        this.auctionModel.inputPage = _utility.getQueryString("inputPage");

        this.scope.auctionModel = this.auctionModel;

        this.getAuctionList();

        this.onEvent();

        this.getAllGoods();
    },

    reFresh: function(){
        var self = this;

        $("#startTime").val("");
        $("#endTime").val("");
        self.auctionModel.goodsName = null;
        self.auctionModel.initPrice = 0;
        self.auctionModel.lowPrice = null;
        self.auctionModel.marginPrice = 0;
        self.auctionModel.referencePrice = 0;
        self.auctionModel.keyWords = null;
        self.auctionModel.startIndex = 0;
    },

    //竞拍列表
    getAuctionList: function(type){
        var self = this;

        pageController.pageInit(self.scope, api.API_GET_AUCTION_LIST, {},

            function(data){
                self.getData(data);
            });

        if(_utility.isEmpty(type))
        {
            if(!_utility.isEmpty(self.auctionModel.inputPage))
            {
                pageController.reFreshCurPageJump(self.auctionModel.selNum, self.auctionModel.nowPage,
                    self.auctionModel.totalPage, self.auctionModel.inputPage, function(data) {
                        self.getData(data);
                    }
                )
            }
        }
    },

    /**
     * @param data.count
     * @param data.auctionItems 展品列表
     * @param data.auctionItems.currentPrice 当前价格
     * @param data.auctionItems.bidsNum 竞拍次数
     * @param data.auctionItems.initialPrice 初始价格
     * @param data.auctionItems.lowestPremium 最低加价
     * @param data.auctionItems.referencePrice 参考价
     * @param data.auctionItems.margin 保价
     */
    getData: function(data){
        var self = this,
            nowTimestamp = Math.round(new Date() / 1000);

        if(self.scope.page.selectPageNum)
        {
            var totalNum = Math.ceil(data.count / self.scope.page.selectPageNum);
            pageController.pageNum(totalNum);
        }

        self.auctionModel.modelArr = data.auctionItems;

        for(var i = 0, len = self.auctionModel.modelArr.length; i < len; i++)
        {
            var status = self.auctionModel.modelArr[i].status,
                sTime = self.auctionModel.modelArr[i].startTime,
                eTime = self.auctionModel.modelArr[i].endTime;

            self.auctionModel.modelArr[i].selected = false;
            self.auctionModel.modelArr[i].type = self.fundAuctionType(status, sTime, eTime, nowTimestamp);

            if(!_utility.isEmpty(self.auctionModel.modelArr[i].goodsInfo.goods_pics))
            {   //默认取第一张图片
                self.auctionModel.modelArr[i].pic = JSON.parse(self.auctionModel.modelArr[i].goodsInfo.goods_pics)[0];
            }
        }

        self.auctionModel.isShowInfo = false;
        self.scope.$apply();
    },

    /**
     * 判断竞拍状态
     * @param status 竞拍状态
     * @param sTime 上拍时间
     * @param eTime 截拍时间
     * @param nowTimestamp 当前时间戳
     * @returns {*}
     */
    fundAuctionType: function(status, sTime, eTime, nowTimestamp){
        var type = null;

        if(status == 1)
        {
            type = "已下架";
        }
        else
        {
            if(nowTimestamp < sTime)
            {
                type = "已上拍";
            }
            else if(nowTimestamp > eTime)
            {
                type = "已截拍";
            }
            else
            {
                type = "正在拍卖";
            }
        }

        return type;
    },

    //获取藏品
    getAllGoods: function(keywords){
        var self = this,
            params = {
                startIndex: self.auctionModel.startIndex,
                num: 10 //默认每次取10个数据
            };

        if(!_utility.isEmpty(keywords))
        {
            params.likeStr = keywords
        }
        $data.httpRequest("post", api.API_GET_AUCTION_GOODS, params,

            /**
             * @param data.goods 全部藏品
             */
            function(data){
                var goods = data.goods,
                    totalPage = Math.ceil(goods.length / 10);

                self.auctionModel.allGoodsArr = [];
                for(var i = 0, len = goods.length; i < len; i++)
                {
                    self.auctionModel.allGoodsArr.push({
                        id: goods[i].goods_id,
                        name: goods[i].goods_name,
                        pic: JSON.parse(goods[i].goods_pics)[0]
                    })
                }

                $("#simplePage").createPage({
                    pageCount: totalPage,
                    current: 1,
                    backFn: function(curPage){
                        self.auctionModel.startIndex = (curPage-1)*10;
                        self.getAllGoods(self.auctionModel.keyWords);
                    }
                });
            }
        );
    },

    //获取单个藏品
    getSingleGoods: function(id){
        var self = this,
            params = {
                itemId: id
            };

        $data.httpRequest("post", api.API_GET_AUCTION_INFO, params,

            /**
             * 根据ID获取单个藏品信息
             * @param data.allInfo 藏品信息
             */
            function(data){
                self.reFresh();

                var goodsInfo = data.allInfo;

                self.auctionModel.goodsName = goodsInfo.goodsInfo.goods_name;
                $("#startTime").val(_utility.formatDate(goodsInfo.startTime));
                $("#endTime").val(_utility.formatDate(goodsInfo.endTime));
                self.auctionModel.initPrice = parseFloat(goodsInfo.initialPrice);
                self.auctionModel.lowPrice = parseFloat(goodsInfo.lowestPremium);
                self.auctionModel.referencePrice = parseFloat(goodsInfo.referencePrice);
                self.auctionModel.marginPrice = parseFloat(goodsInfo.margin);

                self.auctionModel.isShowInfo = true;
                self.auctionModel.modalTitle = CN_TIPS.MOD_GOODS;
                self.scope.$apply();
            }
        )
    },

    onEvent: function(){
        var self = this,
            flag = true; //判断是否已经layer.photos

        //查看图片大图
        self.scope.checkImg = function(){
            if(flag)
            {
                flag = false;
				layer.ready(function(){
                	layer.photos({
	                    photos: '#tBodyAuction',
	                    anim: 5,
	                    move: false
	                });
                })
            }
        };

        //搜索
        self.scope.searchGoods = function(){
            self.getAllGoods(self.auctionModel.keyWords);
        };

        //选择一个藏品
        self.scope.selCurGoods = function(item){
            self.auctionModel.curID = item.id;
            self.auctionModel.goodsName = item.name;
            $(".sel-goods-box").removeClass("ctrl-goods-show");
        };

        //下架
        self.scope.offShelves = function(id){
            self.auctionModel.curID = id;
            self.offShelvesGoods();
        };

        //显示添加藏品盒子
        self.scope.checkGoodsBox = function(){
            $(".sel-goods-box").addClass("ctrl-goods-show");
        };

        //关闭藏品盒子
        self.scope.closeGoodsBox = function(){
            $(".sel-goods-box").removeClass("ctrl-goods-show");
        };

        //全选
        self.scope.allSel = function(){
            commonFn.switchSelAll(self.auctionModel);
        };

        //单选
        self.scope.oneSel = function(curID){
            commonFn.switchSelOne(curID, self.auctionModel, "id");
        };

        //删除
        self.scope.delAuctions = function(){
            var ids = commonFn.findSelIds(self.auctionModel, 'id');
            if(!_utility.isEmpty(ids))
            {
                commonFn.delListByIds(ids, 'itemIds', api.API_DEL_AUCTION_ITEM, function(){
                    layer.msg(CN_TIPS.DEL_OK, {time: 1600, anim: 5});

                    if(self.auctionModel.selectAll)
                    {
                        self.getAuctionList(1);
                        self.auctionModel.selectAll = false;
                    }
                    else
                    {
                        pageController.reFreshCurPage();
                    }
                })
            }
        };

        //初始化时间设置
        var start = {
            format: 'YYYY-MM-DD hh:mm:ss',
            minDate: $.nowDate(0),
            isinitVal:true,
            maxDate: '2099-06-16 23:59:59',
            choosefun: function(elem,datas){
                end.minDate = datas;
                $("#endTime").val($.addDate(datas, 7)); //默认截拍时间顺延7天
            }
        };
        var end = {
            format: 'YYYY-MM-DD hh:mm:ss',
            minDate: $.nowDate(0),
            isinitVal:true,
            initAddVal: [7],
            maxDate: '2099-06-16 23:59:59',
            choosefun: function(elem, datas){
                start.maxDate = datas;
            }
        };

        //发布藏品
        self.scope.addAuction = function(){
            self.auctionModel.isShowInfo = true;
            self.auctionModel.modalTitle = CN_TIPS.PUBLISH_GOODS;
            self.auctionModel.isAdd = true;
            self.reFresh();

            var $startTime = $("#startTime"),
                $endTime = $("#endTime"),
                timestamp1 = Math.round(new Date() / 1000), //获取当前时间戳
                timestamp2 = timestamp1 + 60*60*24*7, //默认顺延七天
                nowTime = _utility.formatDate(timestamp1, true),
                nowTime2 = _utility.formatDate(timestamp2, true),
                allTime = nowTime +' '+"22:00:00",
                allTime2 = nowTime2 +' '+"22:00:00";

            $startTime.jeDate(start);
            $endTime.jeDate(end);

            //设置默认时间为每天22:00:00
            $startTime.val(allTime);
            $endTime.val(allTime2);
        };

        //修改竞拍藏品
        self.scope.modAuctionGoods = function(id){
            self.auctionModel.curID = id;
            self.auctionModel.isAdd = false;
            self.getSingleGoods(id);

            $("#startTime").jeDate(start);
            $("#endTime").jeDate(end);
        };

        //返回列表
        self.scope.back2main = function(){
            self.auctionModel.isShowInfo = false;
            $(".sel-goods-box").removeClass("ctrl-goods-show");
        };

        //提交数据
        self.scope.submitAuction = function(){
            self.auctionModel.startTime = $("#startTime").val();
            self.auctionModel.endTime = $("#endTime").val();

            if(self.auctionModel.isAdd)
            {
                self.publishGoods();
            }
            else
            {
                self.modAuctionItem();
            }
        };

        //跳页查看竞拍记录
        self.scope.checkBiddingList = function(id, bidsNum){

            if(bidsNum == 0)
            {
                layer.msg(CN_TIPS.NO_DATA, {time: 1600, anim: 5});
            }
            else
            {
                var selNum = self.scope.page.selectPageNum,
                    nowPage = self.scope.page.currentPage,
                    totalPage = self.scope.page.totalPage,
                    inputPage = self.scope.page.inputPage;

                location.href = JUMP_URL.BIDDING_LIST + "?biddingID=" + id
                    + "&selNum=" + selNum + "&nowPage=" + nowPage
                    + "&totalPage=" + totalPage + "&inputPage=" + inputPage;
            }
        };
    },

    //发布藏品
    publishGoods: function(){
        var self = this,
             params = {
                goodsId: self.auctionModel.curID,
                initialPrice: self.auctionModel.initPrice,
                lowestPremium: self.auctionModel.lowPrice,
                referencePrice: self.auctionModel.referencePrice,
                margin: self.auctionModel.marginPrice,
                startTime: self.auctionModel.startTime,
                endTime: self.auctionModel.endTime
            };

        if(self.checkParams(params))
        {
            $data.httpRequest("post", api.API_RELEASE_AUCTION_ITEM, params, function(){
                layer.msg(CN_TIPS.PUBLISH_OK, {time: 1600, anim: 5});

                self.getAuctionList(1);
            })
        }
    },

    //修改藏品
    modAuctionItem: function(){
        var self = this,
            params = {
                itemId: self.auctionModel.curID
            },
            modInfo = {};
        modInfo.initialPrice = self.auctionModel.initPrice;
        modInfo.lowestPremium = self.auctionModel.lowPrice;
        modInfo.referencePrice = self.auctionModel.referencePrice;
        modInfo.margin = self.auctionModel.marginPrice;
        modInfo.startTime = self.auctionModel.startTime;
        modInfo.endTime = self.auctionModel.endTime;

        if(self.checkParams(modInfo, 1))
        {
            params.modInfo = JSON.stringify(modInfo);
            $data.httpRequest("post", api.API_MOD_AUCTION_ITEM, params, function(){
                layer.msg(CN_TIPS.MOD_OK, {time: 1600, anim: 5});

                self.getAuctionList(1);
            })
        }
    },

    //下架藏品
    offShelvesGoods: function(){
        var self = this,
            params = {
                itemId: self.auctionModel.curID
            };

        $data.httpRequest("post", api.API_SET_AUCTION_OFF, params, function(){
            layer.msg(CN_TIPS.OPERATE_OK, {time: 1600, anim: 5});

            pageController.reFreshCurPage();
        });
    },

    //检查参数
    checkParams: function(params, type){
        if(_utility.isEmpty(params.goodsId) && _utility.isEmpty(type))
        {
            layer.msg(CN_TIPS.SELECT_GOODS, {time: 1600, anim: 5});
            return false;
        }
        if(_utility.isEmpty(params.startTime))
        {
            layer.msg(CN_TIPS.SELECT_START_TIME, {time: 1600, anim: 5});
            return false;
        }
        if(_utility.isEmpty(params.endTime))
        {
            layer.msg(CN_TIPS.SELECT_END_TIME, {time: 1600, anim: 5});
            return false;
        }
        if(params.startTime > params.endTime)
        {
            layer.msg(CN_TIPS.COMPARE_TIME, {time: 1600, anim: 5});
            return false;
        }
        if(_utility.isEmpty(params.lowestPremium))
        {
            layer.msg(CN_TIPS.LOW_PRICE_BLANK, {time: 1600, anim: 5});
            return false;
        }

        return true;
    }
};