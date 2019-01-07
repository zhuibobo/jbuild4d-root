//页面样式辅助功能类
var PageStyleUtility = {
    GetPageHeight: function () {
        return jQuery(window.document).height();
    },
    GetPageWidth: function () {
        return jQuery(window.document).width();
    },
    GetWindowHeight:function () {
        return $(window).height();
    },
    GetWindowWidth:function () {
        return $(window).width();
    },
    GetListButtonOuterHeight: function () {
        alert("PageStyleUtility.GetListButtonOuterHeight 已停用");
        return jQuery(".list-button-outer-c").outerHeight();
    }
};