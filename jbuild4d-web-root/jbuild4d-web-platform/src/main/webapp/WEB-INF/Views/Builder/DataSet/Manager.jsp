<%--
  Created by IntelliJ IDEA.
  User: zhuangrb
  Date: 2018/8/7
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ include file="/WEB-INF/Views/TagLibs/TagLib.jsp" %>
<html>
<head>
    <title>Title</title>
    <%@ include file="/WEB-INF/Views/TagLibs/GeneralLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/IViewLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/JQueryUILib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ZTreeLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/TreeTableLib.jsp" %>
    <%@ include file="/WEB-INF/Views/TagLibs/ThemesLib.jsp" %>
</head>
<body>
    <div id="appList" class="list-2column">
        <div class="left-outer-wrap-c">
            <div class="left-page-c">
                <div class="tool-bar-c">
                    <div alt="新增分类组" title="新增分类组" class="add" @click="addGroup()"></div>
                    <div alt="修改分类组" title="修改分类组" class="edit" @click="editGroup"></div>
                    <div alt="删除分类组" title="删除分类组" class="del" @click="delGroup"></div>
                    <div alt="浏览分类组" title="浏览分类组" class="view" @click="viewGroup"></div>
                    <div alt="上移" title="上移" class="order-up" @click="moveGroup('up')"></div>
                    <div alt="下移" title="下移" class="order-down last" @click="moveGroup('down')"></div>
                </div>
                <div>
                    <ul id="ztreeUL" class="ztree"></ul>
                </div>
            </div>
        </div>
        <div class="right-outer-wrap-c" style="padding: 10px">
            <div class="list-simple-search-wrap" id="list-simple-search-wrap">
                <table class="ls-table">
                    <colgroup>
                        <col style="width: 80px">
                        <col style="">
                        <col style="width: 80px">
                        <col style="">
                        <col style="width: 80px">
                    </colgroup>
                    <tr class="ls-table-row">
                        <td>标题：</td>
                        <td>
                            <i-input v-model="searchCondition.tableCaption.value" placeholder=""></i-input>
                        </td>
                        <td>表名：</td>
                        <td>
                            <i-input v-model="searchCondition.tableName.value" placeholder=""></i-input>
                        </td>
                        <td><i-button type="primary" @click="search"><Icon type="android-search"></Icon> 查询 </i-button></td>
                    </tr>
                </table>
            </div>
            <div id="list-button-wrap" class="list-button-outer-wrap">
                <div class="list-button-inner-wrap">
                    <i-button type="success" @click="add()"><Icon type="plus"></Icon> 新增 </i-button>
                    <i-button type="primary" @click="move('up')"><Icon type="arrow-up-b"></Icon> 上移 </i-button>
                    <i-button type="primary" @click="move('down')"><Icon type="arrow-down-b"></Icon> 下移 </i-button>
                    <i-button type="primary" v-if="listButton.showExportDocument" @click="exportDBDocument()"><Icon type="arrow-down-b"></Icon> 导出表结构文档 </i-button>
                </div>
                <div style="clear: both"></div>
            </div>
            <i-table :height="listHeight" stripe border :columns="columnsConfig" :data="tableData"
                     class="iv-list-table" :highlight-row="true"
                     @on-selection-change="selectionChange"></i-table>
            <div style="float: right;" id="list-pager-wrap">
                <page @on-change="changePage" :current.sync="pageNum" :page-size="pageSize" show-total
                      :total="pageTotal"></page>
            </div>
        </div>
    </div>
    <script>

    </script>
</body>
</html>
