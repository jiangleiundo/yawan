/**
 * config data
 */

//基础接口url
//var BASE_URL = "http://meeno.f3322.net:8082/auction/index.php/"; //内网Url
//var BASE_URL = "http://192.168.2.23:8082/auction/index.php/"; //内网Url
var BASE_URL = "http://mc.meeno.net:8082/auction/index.php/"; //内网Url

var BASE_JUMP_URL = "../admin/index.html#/";

//api
var api = {
	API_ADMIN_LOGIN : BASE_URL + "account/login", //登录
	API_GET_USER_STATISTICS : BASE_URL + "a_admin/getUserStatistics", //用户数目统计
    API_MOD_ADMIN_PWD : BASE_URL + "a_admin/modAdminPassword", //修改管理员密码

    //清除缓存
    API_CLEAR_CACHE : BASE_URL + "common/clearRedis", //清除缓存

    //藏品列表
    API_GET_GOODS_LIST : BASE_URL + "goods/Goods/getGoods", //获取藏品列表
    API_ADD_GOODS : BASE_URL + "goods/A_goods/createGoods", //新增藏品
    API_MOD_GOODS : BASE_URL + "goods/A_goods/modGoods", //修改藏品
    API_GET_SINGLE_GOODS : BASE_URL + "goods/Goods/getOneGoods", //获取单个藏品
    API_DEL_GOODS : BASE_URL + "goods/A_goods/delGoods", //删除藏品

    //拍卖
    API_GET_AUCTION_LIST : BASE_URL + "auction/A_auction/getAuctionItems", //竞拍展品列表
    API_GET_BIDDING_LIST : BASE_URL + "auction/Auction/getBiddingList", //竞拍记录
    API_GET_AUCTION_INFO : BASE_URL + "auction/Auction/getAuctionAllInfo", //根据ID展品信息
    API_RELEASE_AUCTION_ITEM : BASE_URL + "auction/A_auction/releaseAuctionItem", //发布展品
    API_MOD_AUCTION_ITEM : BASE_URL + "auction/A_auction/modActionItem", //修改展品
    API_DEL_AUCTION_ITEM : BASE_URL + "auction/A_auction/delAuctionItems", //删除展品
    API_GET_AUCTION_GOODS : BASE_URL + "auction/A_auction/getAuctionGoods", //获取藏品列表
    API_SET_AUCTION_OFF : BASE_URL + "auction/A_auction/setAuctionItemOff", //下架展品

    //管理员
    API_GET_ADMIN_LIST : BASE_URL + "a_admin/getAdminList", //管理员列表
    API_DEL_ADMIN : BASE_URL + "a_admin/deleteAdmin", //删除管理员
    API_MOD_ADMIN : BASE_URL + "a_admin/modAdmin", //修改管理员
    API_ADD_ADMIN : BASE_URL + "a_admin/addAdminAccount", //添加管理员

    //用户管理
    API_GET_USER_LIST : BASE_URL + "a_admin/searchUserList", //用户列表
    API_MOD_USER_INFO : BASE_URL + "a_admin/modUserInfo", //修改个人信息
    API_GET_SINGLE_BIDDING_LIST : BASE_URL + "auction/Auction/getPersonalBiddingList", //获取个人竞拍记录

    //上传文件
    API_UP_FILE : BASE_URL + "upload/uploadImages"
};

//errType
var errCode = {
    success: 0,
    tokenFail: 3
};

//本地存储兼职
var strKey = {
    K_PHP_SESSION_ID: "K_PHP_SESSION_ID",
    K_ADMIN_TYPE: "K_ADMIN_TYPE",
    K_USER: "K_USER",
    K_PWD: "K_PWD",
    IS_REM: "IS_REM",
    K_USER_INFO: "K_USER_INFO"
};

//文字提示
var CN_TIPS = {
    ADD_ADMIN: "添加管理员",
    ADD_INFO: "添加藏品",
    ADD_OK: "添加成功",
    BLANK_TITLE: "标题不能为空",
    BLANK_CONTENT: "内容不能为空",
    COMMON_ADMIN: "普通管理员",
    COMPARE_TIME: "结束时间不能小于开始时间",
    CLEAR_CACHE: "清除缓存成功",
    DIFF_PWD: "两次密码输入不一致",
    DEL_OK: "删除成功",
    INPUT_USER_NAME: "请输入用户名",
    INPUT_PWD: "请输入密码",
    LOW_PRICE_BLANK: "最低加价不能为空",
    MOD_GOODS: "修改展品",
    MOD_ADMIN: "修改管理员",
    MOD_OK: "修改成功",
    MOD_INFO: "修改藏品",
    NO_DATA: "暂无数据",
    NEW_PWD_BLANK: "新密码不能为空",
    OPERATE_OK: "操作成功",
    PIC_BLANK: "请上传图片",
    PWD_BLANK: "密码不能为空",
    PUBLISH_GOODS: "发布展品",
    PUBLISH_OK: "发布成功",
    SUPER_ADMIN: "超级管理员",
    SELECT_GOODS: "请选择藏品",
    SELECT_START_TIME: "请选择开始时间",
    SELECT_END_TIME: "请选择结束时间",
    USER_NAME_BLANK: "用户名不能为空",
    UP_LOAD_PIC: "上传图片",
    UP_LOAD_VIDEO: "上传视频"
};

//跳转页面
var JUMP_URL = {
    SINGLE_BIDDING_LIST: BASE_JUMP_URL + "bidding2", //个人竞拍记录
    USER_LIST: BASE_JUMP_URL + "user", //用户
    BIDDING_LIST: BASE_JUMP_URL + "bidding", //竞拍记录
    AUCTION_LIST: BASE_JUMP_URL + "auction" //竞拍藏品
};

//权限2级
var adminPermission = [{id: '101', val: '管理员列表'}],
    userPermission = [{id: '201', val: '用户信息'}],
    goodsPermission = [{id: '301', val: '藏品列表'}],
    auctionPermission = [{id: '401', val: '拍卖列表'}];

//权限1级
var permissionArr = [
    {id: '1', val: '管理员管理', secPermission: adminPermission},
    {id: '2', val: '用户管理', secPermission: userPermission},
    {id: '3', val: '藏品管理', secPermission: goodsPermission},
    {id: '4', val: '拍卖管理', secPermission: auctionPermission}
];