/*
 * 上传图片
 */
var upLoadFile = {
    inputIdArr : [], //存储所有上传按钮ID
    formIdArr : [], //存储所有form表单ID
    curInputID: null, //当前点击的上传按钮ID
    curFormat: null, //当前需要验证的格式

    /**
     * 上传文件到本地服务器
     * @param formId 表单ID
     * @param inputId 上传按钮ID
     * @param type 上传文件类型1表示图片，2表示视频，3表示不限制格式
     * @param callback 成功回调
     */
    start : function(formId, inputId, type, callback){

        var self = this;
        var options = {
            url : api.API_UP_FILE,
            beforeSubmit:  self.showRequest,
            success : callback,
            resetForm: true,
            dataType:  'json'
        };

        self.curInputID = inputId;
        self.curFormat = type;

        if(!self.checkIfInit(self.inputIdArr, inputId)) //相同的ID只綁定一次事件
        {
            $("#" + inputId).on("change", function(){
                $("#" + formId).submit();
            });
            self.inputIdArr.push(inputId);
        }

        if(!self.checkIfInit(self.formIdArr, formId))
        {
            var $formID = $("#" + formId);
            $formID.ajaxForm(function(){});

            $formID.submit(function(){
                $(this).ajaxSubmit(options);
                return false;
            });
            self.formIdArr.push(formId);
        }
    },

    /**
     * 上传提交前处理数据
     * @param formData 上传表单所有文件组成的一个数组
     */
    showRequest: function(formData){
        var file = formData[0].value.type,
            formatArr = []; //这里可以限定上传图片和视频格式
            formatArr[1] = !/\/(?:jpg|png|jpeg|gif|bmp)/i.test(file); //图片格式
            formatArr[2] = !/\/(?:mp4|WebM|ogg|MOV)/i.test(file); //视频格式
            formatArr[3] = false; //不限制格式

        if(formatArr[upLoadFile.curFormat]) {
            alert("格式不正确！");

            $("#"+ upLoadFile.curInputID).val(""); //如果不成功就清空文件域，tip:在IE中安全设置的原因不允许清空文件域
            return false; //如果“beforeSubmit”回调函数返回false，那么表单将不被提交
        }
    },

    /**
     * 检查是否已经初始化以保证相同ID只初始化一次
     * @param arr 存储所有上传或提交按钮ID
     * @param curID 当前点击对象的ID
     */
    checkIfInit: function(arr, curID){
        for(var i = 0; i < arr.length; i++)
        {
            if(arr[i] == curID)
            {
                return true;
            }
        }
        return false;
    },

    //上传图片预览图片方法
    previewImage : function(file, id, bgId)
    {
        var MAXWIDTH  = 260;
        var MAXHEIGHT = 180;

        var img = document.getElementById(id);

        img.onload = function()
        {
            var rect = upLoadFile.clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
            img.width  =  rect.width;
            img.height =  rect.height;
        };

        var reader = new FileReader();

        reader.onload = function(evt)
        {
            img.src = evt.target.result;
            $("#" + bgId).css('background-image','url('+img.src+')');
        };

        reader.readAsDataURL(file.files[0]);
    },

    clacImgZoomParam : function(maxWidth, maxHeight, width, height){

        var param = {top:0, left:0, width:width, height:height};
        if( width>maxWidth || height>maxHeight )
        {
            rateWidth = width / maxWidth;
            rateHeight = height / maxHeight;

            if( rateWidth > rateHeight )
            {
                param.width =  maxWidth;
                param.height = Math.round(height / rateWidth);
            }
            else
            {
                param.width = Math.round(width / rateHeight);
                param.height = maxHeight;
            }
        }

        param.left = Math.round((maxWidth - param.width) / 2);
        param.top = Math.round((maxHeight - param.height) / 2);
        return param;
    }
};
