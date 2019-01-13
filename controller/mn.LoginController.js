/* 用户登录 */
$(function(){
    var isRem = localStorage.getItem(strKey.IS_REM); //是否记住密码

    txtUn.val(localStorage.getItem(strKey.K_USER));

    if(isRem == true || isRem == "true")
    {
        txtPwd.val(localStorage.getItem(strKey.K_PWD));
        login.isSavePwd = true;
        $(".rem").find("span").attr("class", "has-sel");
    }
    else
    {
        txtPwd.val("");
    }
});

var txtUn = $("#txtUn"),
    txtPwd = $("#txtPwd");

login.inputPropertyChange(txtUn, txtPwd);

//是否记住密码

login.saveClick();
    $("#btnlogin").on("click", function(){
    adminLogin();
});

document.onkeypress = function(){
    //13 回车键
    if(event.keyCode == 13){
        adminLogin();
    }
};

var adminLogin = function(){
    var ret = login.validate(txtUn.val(), txtPwd.val()),
        params = {
            userType: 2,
            platform: 1,
            platformId: txtUn.val(),
            password: txtPwd.val()
        };

    if(ret)
    {
        localStorage.setItem(strKey.K_PHP_SESSION_ID, "");
        $data.httpRequest("post", api.API_ADMIN_LOGIN, params,
            /**
             * 成功回调
             * @param data
             * @param data.sessionId
             * @param data.adminType 管理员类型
             * @param data.userInfo.entries 权限
             */
            function(data){

                $(".btn-item").hide().eq(1).show(); //显示登录中...

                //存储session，admin类型，用户名
                localStorage.setItem(strKey.K_PHP_SESSION_ID, data.sessionId);
                localStorage.setItem(strKey.K_USER_INFO, JSON.stringify(data.userInfo));
                localStorage.setItem(strKey.K_USER, txtUn.val());
                localStorage.setItem(strKey.IS_REM, login.isSavePwd);

                if(login.isSavePwd) //判断是否记住密码
                {
                    localStorage.setItem(strKey.K_PWD, txtPwd.val());
                }
                else
                {
                    localStorage.setItem(strKey.K_PWD, "");
                }

                location.href = "index.html";
            }
        );
    }
};
