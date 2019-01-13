/**
 * controller
 */

var app = angular.module('app', [
    'ui.router'
]);

app.controller('ContentCtrl',function($scope){ //首页
    ContentCtrl.init($scope);
});

app.controller('GoodsCtrl', function($scope){ //藏品
    GoodsCtrl.init($scope);
});

app.controller('AuctionCtrl', function($scope){ //拍卖
    AuctionCtrl.init($scope);
});

app.controller('BiddingCtrl', function($scope){ //竞拍记录
    BiddingCtrl.init($scope);
});

app.controller('BiddingSingleCtrl', function($scope){ //个人竞拍记录
    BiddingSingleCtrl.init($scope);
});

app.controller('AdminCtrl', function($scope){ //管理员
    AdminCtrl.init($scope);
});

app.controller('UserCtrl', function($scope){ //用户
    UserCtrl.init($scope);
});
