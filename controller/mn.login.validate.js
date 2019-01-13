var login={

    isSavePwd: false,

    validate: function(un, pwd){

        var ret = false,
            $formGroup = $(".form-group");

        if(un == "" && pwd == "")
        {
            $formGroup.addClass("form-err");
            $formGroup.eq(0).children("i").attr("class", "unerr");
            $formGroup.eq(1).children("i").attr("class", "pwderr");
            $(".errdes-un").text(CN_TIPS.INPUT_USER_NAME);
            $(".errdes-pwd").text(CN_TIPS.INPUT_PWD);
            ret=false
        }
        else
        {
            if(un == "")
            {
                $formGroup.eq(0).addClass("form-err");
                $formGroup.eq(0).children("i").attr("class","unerr");
                $(".errdes-un").text(CN_TIPS.INPUT_USER_NAME);
                ret=false
            }
            else
            {
                if(pwd == "")
                {
                    $formGroup.eq(1).addClass("form-err");
                    $formGroup.eq(1).children("i").attr("class","pwderr");
                    $(".errdes-pwd").text(CN_TIPS.INPUT_PWD);
                    ret=false
                }
                else
                {
                    ret=true
                }
            }
        }
        return ret
    }

    ,inputPropertyChange: function(txtUn, txtPwd){
        var $formGroup = $(".form-group");

        txtUn.on("input propertychange", function(){
            if($(this).val()!="")
            {
                $formGroup.eq(0).removeClass("form-err");
                $formGroup.eq(0).children("i").attr("class","un");
                $(".errdes-un").empty()
            }
        });

        txtPwd.on("input propertychange", function(){
            if($(this).val()!="") {
                $formGroup.eq(1).removeClass("form-err");
                $formGroup.eq(1).children("i").attr("class","pwd");
                $(".errdes-pwd").empty()
            }
        })
    },

    saveClick: function() {
        $(".rem").find("span").on("click", function() {
            var currentClass = $(this).attr("class"),
                currentClass2 = (currentClass == "un-sel")? "has-sel": "un-sel";

            login.isSavePwd = (currentClass2 != "un-sel");
            $(this).attr("class", currentClass2);
        })
    }
};