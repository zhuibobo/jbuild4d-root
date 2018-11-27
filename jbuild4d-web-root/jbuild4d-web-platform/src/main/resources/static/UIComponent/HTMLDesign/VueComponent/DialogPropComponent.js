Vue.component("fd-control-bind-to", {
    data: function () {
        return {
            count: 0
        }
    },
    template: '<table cellpadding="0" cellspacing="0" border="0" class="dialog-table-wraper">' +
                    '<colgroup>' +
                        '<col style="width: 100px" />' +
                        '<col style="width: 280px" />' +
                        '<col style="width: 100px" />' +
                        '<col />' +
                    '</colgroup>' +
                    '<tr>' +
                        '<td colspan="4">' +
                        '    绑定到表<button class="btn-select fright" onclick="JBuild4D.FormDesign.InnerDialog.SelectBindTableFieldTo()">...</button>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>表名：</td>' +
                        '<td></td>' +
                        '<td>表标题：</td>' +
                        '<td></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>字段名：</td>' +
                        '<td></td>' +
                        '<td>表标题：</td>' +
                        '<td></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td>类型：</td>' +
                        '<td></td>' +
                        '<td>长度：</td>' +
                        '<td></td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td colspan="4">' +
                        '    校验规则<button class="btn-select fright">...</button>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td colspan="4" style="background-color: #ffffff">' +
                            '<table class="dialog-table-wraper">' +
                                '<colgroup>' +
                                    '<col style="width: 100px" />' +
                                    '<col />' +
                                '</colgroup>' +
                                '<tr>' +
                                    '<td>类型：</td>' +
                                    '<td></td>' +
                                '</tr>' +
                                '<tr>' +
                                    '<td>设置：</td>' +
                                    '<td></td>' +
                                '</tr>' +
                            '</table>' +
                        '</td>' +
                    '</tr>' +
                '</table>'
})