/**
 *router
 */

app.config(function($stateProvider, $urlRouterProvider){
	
	$urlRouterProvider.otherwise('/content');
	
	$stateProvider
	    .state('content',{
	    	url: '/content',
            templateUrl: 'view/content/mn.content.html',
            controller: 'ContentCtrl'
	    })
        .state('goods', {
            url: '/goods',
            templateUrl: 'view/goods/mn.goods.html',
            controller: 'GoodsCtrl'
        })
        .state('auction', {
            url: '/auction',
            templateUrl: 'view/auction/mn.auction.html',
            controller: 'AuctionCtrl'
        })
        .state('bidding', {
            url: '/bidding',
            templateUrl: 'view/auction/biddingList.html',
            controller: 'BiddingCtrl'
        })
        .state('bidding2', {
            url: '/bidding2',
            templateUrl: 'view/user/biddingList.html',
            controller: 'BiddingSingleCtrl'
        })
        .state('admin', {
            url: '/admin',
            templateUrl: 'view/admin/mn.admin.html',
            controller: 'AdminCtrl'
        })
        .state('user', {
            url: '/user',
            templateUrl: 'view/user/mn.user.html',
            controller: 'UserCtrl'
        })
});