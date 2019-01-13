//富文本编辑器
var myEditor;
KE.keInit("myEditor", "", "ke-icon-upImg", "ke-icon-upVideo", function(editor){myEditor = editor});

//上传视频依赖$sce
app.filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]);

var GoodsCtrl = {
    scope: null,

    goodsModel: {
        modelArr: [],
        selectAll: false,
        isInfoShow: false, //是否显示藏品信息
        curID: null,       //当前藏品ID
        isAdd: true,       //添加or修改藏品
        modalTitle: null,  //添加or修改标题
        goodsTitle: null,  //藏品标题
        goodsPic: [],      //藏品图片
        extraIsImg: true,  //富文本是否上传图片
        picUrl: null,      //富文本上传图片URL
        videoUrl: null     //富文本上传视频URL
    },

    init: function($scope){
        this.scope = $scope;

        this.scope.goodsModel = this.goodsModel;

        this.getList();

        this.onEvent();
    },

    reFresh: function(){
        var self = this;

        self.goodsModel.goodsTitle = null;
        self.goodsModel.goodsPic = [];
    },

    reFreshModal: function(){
        var self = this;

        self.goodsModel.picUrl = null;
        self.goodsModel.videoUrl = null;
    },

    //获取藏品列表
    getList: function(){
        var self = this;

        pageController.pageInit(self.scope, api.API_GET_GOODS_LIST, {},

            /**
             * @param data.count 计数
             * @param data.goods 藏品数组
             * @param data.goods.goods_name 藏品名
             * @param data.goods.goods_id 藏品id
             * @param data.goods.goods_pics 藏品图片arr
             */
            function(data){
                if(self.scope.page.selectPageNum)
                {
                    var totalPage = Math.ceil(data.count / self.scope.page.selectPageNum);
                    pageController.pageNum(totalPage);
                }

                self.goodsModel.modelArr = data.goods;

                for(var i = 0, len = self.goodsModel.modelArr.length; i < len; i++)
                {
                    var firstPicCopy = JSON.parse(self.goodsModel.modelArr[i].goods_pics)[0];
                    if(!_utility.isEmpty(firstPicCopy))
                    {
                        self.goodsModel.modelArr[i].firstPic = firstPicCopy; //取第一张图片
                    }
                    self.goodsModel.modelArr[i].selected = false;
                }
                self.goodsModel.isInfoShow = false;
                self.scope.$apply();
            }
        )
    },

    //获得单个藏品
    getSingleGoods: function(id){
        var self = this,
            params = {
                goodsId: id
            };

        $data.httpRequest("post", api.API_GET_SINGLE_GOODS, params, function(data){

            var singleObj = data.goodsInfo;
            self.goodsModel.goodsTitle = singleObj.goods_name;
            self.goodsModel.goodsPic = JSON.parse(singleObj.goods_pics);
            self.scope.$apply();
            self.modEditor(singleObj.goods_detail);
        })
    },

    //点击事件
    onEvent: function(){
        var self = this,
            flag = true;

        //查看图片大图
        self.scope.checkImg = function(){

            if(flag)
            {
                flag = false;
                layer.ready(function(){
                	layer.photos({
	                    photos: '#tBody',
	                    anim: 5,
	                    move: false
	                });
                })
            }
        };

        //全选
        self.scope.allSel = function(){
            commonFn.switchSelAll(self.goodsModel);
        };

        //单选
        self.scope.oneSel = function(curID){
            commonFn.switchSelOne(curID, self.goodsModel, 'goods_id');
        };

        //删除藏品
        self.scope.delGoods = function(){
            var ids = commonFn.findSelIds(self.goodsModel, 'goods_id');
            if(!_utility.isEmpty(ids))
            {
                commonFn.delListByIds(ids, 'goodsIds', api.API_DEL_GOODS, function(){
                    layer.msg(CN_TIPS.DEL_OK, {time: 1600, anim: 5});

                    if(self.goodsModel.selectAll)
                    {
                        self.getList();
                        self.goodsModel.selectAll = false;
                    }
                    else
                    {
                        pageController.reFreshCurPage();
                    }
                })
            }
        };

        //返回
        self.scope.back2GoodsList = function(){
            self.goodsModel.isInfoShow = false;
        };

        //删除图片
        self.scope.delPic = function(idx){
            self.goodsModel.goodsPic.splice(idx, 1);
        };

        //添加
        self.scope.addGoods = function(){
            self.reFresh();

            self.goodsModel.isInfoShow = true;
            self.goodsModel.isAdd = true;
            self.goodsModel.modalTitle = CN_TIPS.ADD_INFO;
            self.upLoadFile1();

            self.addEditor();
        };

        //修改藏品
        self.scope.modGoods = function(curID){
            self.reFresh();

            self.goodsModel.curID = curID;
            self.goodsModel.isInfoShow = true;
            self.goodsModel.isAdd = false;
            self.goodsModel.modalTitle = CN_TIPS.MOD_INFO;
            self.upLoadFile1();

            self.getSingleGoods(curID);
        };

        //提交数据
        self.scope.submitAll = function(){
            if(self.goodsModel.isAdd)
            {
                self.addGoods();
            }
            else
            {
                self.modGoods();
            }
        };
    },

    //添加藏品
    addGoods: function(){
        var self = this,
            params = {},
            goodsInfo = {};

        goodsInfo.goods_name = self.goodsModel.goodsTitle;
        goodsInfo.goods_detail = myEditor.html();
        goodsInfo.goods_pics = JSON.stringify(self.goodsModel.goodsPic);

        if(self.checkParams()){
            params.goodsInfo = JSON.stringify(goodsInfo);
            $data.httpRequest("post", api.API_ADD_GOODS, params, function(){

                layer.msg(CN_TIPS.ADD_OK, {time: 1600, anim: 5});
                self.goodsModel.isInfoShow = false;
                pageController.reFreshCurPage();
                self.scope.$apply();
            })
        }
    },

    //修改藏品
    modGoods: function(){
        var self = this,
            params = {
                goodsId: self.goodsModel.curID
            },
            goodsInfo = {};

        goodsInfo.goods_name = self.goodsModel.goodsTitle;
        goodsInfo.goods_detail = myEditor.html();
        goodsInfo.goods_pics = JSON.stringify(self.goodsModel.goodsPic);

        if(self.checkParams()){
            params.modInfo = JSON.stringify(goodsInfo);

            $data.httpRequest("post", api.API_MOD_GOODS, params, function(){

                layer.msg(CN_TIPS.MOD_OK, {time: 1600, anim: 5});

                self.goodsModel.isInfoShow = false;
                pageController.reFreshCurPage();
                self.scope.$apply();
            })
        }
    },

    //上传藏品图片
    upLoadFile1: function(){
        upLoadFile.start("Form_1", "input_1", 1,

            function(responseText, statusText) {
                if(statusText == "success")
                {
                    GoodsCtrl.goodsModel.goodsPic.push(responseText.data.file[0].url);
                    GoodsCtrl.scope.$apply();
                }
            }
        )
    },

    //富文本上传图片
    upLoadFile2: function(){
        upLoadFile.start("Form_2", "input_2", 1,

            function(responseText, statusText) {
                if(statusText == "success")
                {
                    GoodsCtrl.goodsModel.picUrl = responseText.data.file[0].url;
                    GoodsCtrl.scope.$apply();
                }
            }
        )
    },

    //上传视频
    upLoadFile3: function(){
        upLoadFile.start("Form_3", "input_3", 2,

            function(responseText, statusText) {
                if(statusText == "success")
                {
                    GoodsCtrl.goodsModel.videoUrl = responseText.data.file[0].url;
                    GoodsCtrl.scope.$apply();
                }
            }
        )
    },

    //显示model
    layerShow: function(title){
        var self = this;

        layer.open({
            type: 1,
            title: title,
            skin: 'layer-ex-skin',
            btn: ['确定', '取消'],
            area: '400px',
            content: $("#layerBox"),
            yes: function(){
                //添加数据到富文本
                if(self.goodsModel.extraIsImg)
                {
                    if(!_utility.isEmpty(self.goodsModel.picUrl))
                    {
                        KE.keInsert(1, self.goodsModel.picUrl);
                    }
                }
                else
                {
                    if(!_utility.isEmpty(self.goodsModel.videoUrl))
                    {
                        KE.keInsert(2, self.goodsModel.videoUrl);
                    }
                }

                layer.closeAll();
            }
        })
    },

    //添加富文本
    addEditor: function() {
        var self = this;

        KE.keInit("myEditor", "藏品详情...", "ke-icon-upImg", "ke-icon-upVideo", function(editor){myEditor = editor});

        $(".ke-icon-upImg").on("click", function(){
            self.goodsModel.extraIsImg = true;
            self.reFreshModal();
            self.scope.$apply();
            self.upLoadFile2();
            self.layerShow(CN_TIPS.UP_LOAD_PIC);
        });

        $(".ke-icon-upVideo").on("click", function(){
            self.goodsModel.extraIsImg = false;
            self.reFreshModal();
            self.scope.$apply();
            self.upLoadFile3();
            self.layerShow(CN_TIPS.UP_LOAD_VIDEO);
        });
    },

    //修改富文本
    modEditor: function(content){
        var self = this;

        KE.keInit("myEditor", content, "ke-icon-upImg", "ke-icon-upVideo", function(editor){myEditor = editor});

        $(".ke-icon-upImg").on("click", function(){
            self.goodsModel.extraIsImg = true;
            self.reFreshModal();
            self.scope.$apply();
            self.upLoadFile2();
            self.layerShow(CN_TIPS.UP_LOAD_PIC);
        });

        $(".ke-icon-upVideo").on("click", function(){
            self.goodsModel.extraIsImg = false;
            self.reFreshModal();
            self.scope.$apply();
            self.upLoadFile3();
            self.layerShow(CN_TIPS.UP_LOAD_VIDEO);
        });
    },

    //检查参数是否为空
    checkParams: function(){
        var self = this;

        if(_utility.isEmpty(self.goodsModel.goodsTitle))
        {
            layer.msg(CN_TIPS.BLANK_TITLE, {time: 1600, anim: 5});
            return false;
        }
        if(_utility.isEmpty(self.goodsModel.goodsPic))
        {
            layer.msg(CN_TIPS.PIC_BLANK, {time: 1600, anim: 5});
            return false;
        }
        if(_utility.isEmpty(myEditor.html()))
        {
            layer.msg(CN_TIPS.BLANK_CONTENT, {time: 1600, anim: 5});
            return false;
        }

        return true;
    }
};