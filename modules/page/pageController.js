var pageController = {

    //全局变量
    scope: null,
    api: null,
    callback: null,

    fixedParams: {},
    searchParams:{},

    page: {
        totalPage: 0,
        currentPage: 1,
        selectPageNum: 10,
        inputPage: 1
    },

    // 初始化页面设置
    pageInit: function($scope, api, fixedParams, callback){

        // 恢复设置
        this.page = {
            totalPage: 0,
            currentPage: 1,
            selectPageNum: 10,
            inputPage: 1
        };

        this.scope = $scope;
        this.api = api;
        this.callback = callback;
        this.fixedParams = fixedParams;

        this.initPagination();
        this.pageClick();

        this.callApi();
    },

    //初始化分页UI
    initPagination: function(){
        var self = this;

        self.scope.pageNumSelections = [10, 20, 50, 100];
        self.scope.page = self.page;
    },

    //分页点击事件
    pageClick : function(){
        var self = this;

        //下一页
        self.scope.next = function(){
            if(self.page.currentPage < self.page.totalPage)
            {
                self.page.currentPage ++;
                self.scope.page.currentPage = self.page.currentPage;
                self.callApi();
            }
            else
            {
                layer.msg("已经在最后一页", {time: 1600, anim: 5});
            }
        };

        //上一页
        self.scope.prev = function(){
            if(self.page.currentPage > 1)
            {
                self.page.currentPage --;
                self.scope.page.currentPage = self.page.currentPage;
                self.callApi();
            }
            else
            {
                layer.msg("已经在第一页", {time: 1600, anim: 5});
            }
        };

        //首页
        self.scope.first = function(){
            if(self.page.currentPage != 1)
            {
                self.page.currentPage = 1;
                self.scope.page.currentPage = self.page.currentPage;
                self.callApi();
            }
            else
            {
                layer.msg("已经在第一页", {time: 1600, anim: 5});
            }
        };

        //尾页
        self.scope.last = function(){
            if(self.page.currentPage != self.page.totalPage)
            {
                self.page.currentPage = self.page.totalPage;
                self.scope.page.currentPage = self.page.currentPage;
                self.callApi();
            }
            else
            {
                layer.msg("已经在最后一页", {time: 1600, anim: 5});
            }
        };

        //跳页
        self.scope.jump = function(){
            if(self.page.inputPage > self.page.totalPage || self.page.inputPage <= 0)
            {
                layer.msg("没有此页，请输入有效的页码", {time: 1600, anim: 5});
                self.page.inputPage = 1;
            }
            else
            {
                self.page.currentPage = self.page.inputPage;
                self.callApi();
            }
        };

        //分页变化
        self.scope.changePage = function(){
            self.page.currentPage = 1; //分页变化时从第一页开始
            self.scope.page.currentPage = self.page.currentPage;
            self.callApi();
        };
    },

    // 页数变化时调用此函数设置数字
    pageNum : function(totalPage)
    {
        this.page.totalPage = totalPage;
        this.scope.page.totalPage = this.page.totalPage;
    },

    // 当搜索条件变化的时候调用此方法
    searchChange : function(searchParam)
    {
        // 恢复设置
        this.page = {
            totalPage : 0,
            currentPage : 1,
            selectPageNum : 10,
            inputPage : 1
        };

        this.searchParams = searchParam;

        this.callApi();
        this.searchParams = {};
    },

    //刷新当前页面（不跳页）
    reFreshCurPage: function(){

        this.page = {
            selectPageNum : this.page.selectPageNum,
            currentPage : this.page.currentPage,
            totalPage: this.page.totalPage,
            inputPage: this.page.inputPage
        };

        this.callApi();
    },

    //刷新当前页面（跳页回来）
    reFreshCurPageJump: function(selNum, nowPage, totalPage, inputPage, callback)
    {
        var self = this;

        self.page = {
            selectPageNum : parseInt(selNum),
            currentPage : nowPage,
            totalPage : totalPage,
            inputPage : parseInt(inputPage)
        };
        self.scope.page = self.page;

        self.callback = callback;

        self.callApi();
    },

    //访问接口
    callApi : function(){

        var pageParams = {};
        pageParams.startIndex = (this.page.currentPage - 1) * this.page.selectPageNum;
        pageParams.num = this.page.selectPageNum;

        var params = $.extend(pageParams, this.fixedParams, this.searchParams);
        $data.httpRequest("post", this.api, params, this.callback);
    }
};