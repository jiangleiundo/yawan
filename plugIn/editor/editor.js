var KE = {
    curEditor: null, //当前editor对象

    /**
     * 封装kindEditor
     * @param curID 创建富文本textarea的ID
     * @param con 初始化富文本内容，没有就传空或false
     * @param kIconImg 自定义上传图片的class，没有就传空或false
     * @param kIconVideo 自定义上传视频的class，没有就传空或false
     * @param callback 返回已创建好的编辑器对象obj,通过obj.html()获取编辑器内容，通过obj.html("")清空内容，通过obj.insertHtml()在光标处插入内容
     */
    keInit: function(curID, con, kIconImg, kIconVideo, callback){
        var self = this;

        KindEditor.ready(function(K) {

            K.remove('#'+ curID);
            self.curEditor = K.create('#'+ curID, {
                themeType : 'simple',
                resizeType : 2,
                allowImageUpload : true,
                filterMode : false, //true时根据 htmlTags 过滤HTML代码，false时允许输入任何代码。
                items : [
                    'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                    'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                    'insertunorderedlist', '|', 'link']
            });

            if(con){ K.html('#'+ curID, con);}

            var html = '';
            if(kIconImg){html += '<span class="ke-outline" title="图片"><span class="ke-toolbar-icon ke-toolbar-icon-url ' + kIconImg +'"></span></span>';}
            if(kIconVideo){html += '<span class="ke-outline" title="图片"><span class="ke-toolbar-icon ke-toolbar-icon-url ' + kIconVideo +'"></span></span>';}
            if(kIconImg || kIconVideo){$(".ke-toolbar").append(html);}

            callback(self.curEditor);
        });
    },

    /**
     * 插入数据到富文本
     * @param type 1表示图片，2表示视频
     * @param url 要插入的内容
     */
    keInsert: function(type, url){
        var self = this,
            html = "";

        if(type == 1)
        {
            html = '<span><img style="width: 100%" src="'+ url +'" /></span>';
        }
        else if(type == 2)
        {
            html = '<span><video style="width: 100%" src="'+ url +'" controls="controls"></video></span>';
        }
        else
        {
            html = '<span>'+ url +'</span>';
        }

        self.curEditor.insertHtml(html);
    }
};