package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tbuild_list_resource
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class ListResourceEntity {
    //LIST_ID:
    @DBKeyField
    private String listId;

    //LIST_CODE:列表编号:无特殊作用,序列生成,便于查找
    private String listCode;

    //LIST_NAME:列表名称
    private String listName;

    //LIST_SINGLE_NAME:唯一名称:可以为空,如果存在则必须唯一
    private String listSingleName;

    //LIST_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date listCreateTime;

    //LIST_CREATER:创建人
    private String listCreater;

    //LIST_UPDATE_TIME:更新时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date listUpdateTime;

    //LIST_UPDATER:更新人
    private String listUpdater;

    //LIST_TYPE:列表类型:....
    private String listType;

    //LIST_ISSYSTEM:是否系统所有
    private String listIssystem;

    //LIST_ORDER_NUM:排序号
    private Integer listOrderNum;

    //LIST_DESC:备注
    private String listDesc;

    //LIST_MODULE_ID:所属模块ID
    private String listModuleId;

    //LIST_STATUS:列表状态
    private String listStatus;

    //LIST_ORGAN_ID:组织id
    private String listOrganId;

    //LIST_ORGAN_NAME:组织名称
    private String listOrganName;

    //LIST_DATASET_ID:使用的数据集名称:如果布局容器中没有设置自己的数据集,则使用该处的数据集
    private String listDatasetId;

    //LIST_IS_RESOLVE:是否进行了解析:解析过的列表将不再进行服务端的解析
    private String listIsResolve;

    //LIST_EVERY_TIME_RESOLVE:是否每次都进行服务端解析:默认为否,只解析一次
    private String listEveryTimeResolve;

    //LIST_ENABLE_S_SEAR:是否启用简单查询
    private String listEnableSSear;

    //LIST_ENABLE_C_SEAR:是否启用复杂查询
    private String listEnableCSear;

    //LIST_THEME:风格主题:基于配置文件中的配置
    private String listTheme;

    //LIST_CUST_SERVER_RENDERER:服务端自定义的渲染方法:继承IFormSeverRenderer
    private String listCustServerRenderer;

    //LIST_CUST_REF_JS:引入的脚本:多个通过;分割
    private String listCustRefJs;

    //LIST_CUST_CLIENT_RENDERER:客户端自定义的渲染方法:需要指明具体的方法名称
    private String listCustClientRenderer;

    //LIST_CUST_DESC:自定义设置备注:使用了自定义设置相关方法的备注说明
    private String listCustDesc;

    public ListResourceEntity(String listId, String listCode, String listName, String listSingleName, Date listCreateTime, String listCreater, Date listUpdateTime, String listUpdater, String listType, String listIssystem, Integer listOrderNum, String listDesc, String listModuleId, String listStatus, String listOrganId, String listOrganName, String listDatasetId, String listIsResolve, String listEveryTimeResolve, String listEnableSSear, String listEnableCSear, String listTheme, String listCustServerRenderer, String listCustRefJs, String listCustClientRenderer, String listCustDesc) {
        this.listId = listId;
        this.listCode = listCode;
        this.listName = listName;
        this.listSingleName = listSingleName;
        this.listCreateTime = listCreateTime;
        this.listCreater = listCreater;
        this.listUpdateTime = listUpdateTime;
        this.listUpdater = listUpdater;
        this.listType = listType;
        this.listIssystem = listIssystem;
        this.listOrderNum = listOrderNum;
        this.listDesc = listDesc;
        this.listModuleId = listModuleId;
        this.listStatus = listStatus;
        this.listOrganId = listOrganId;
        this.listOrganName = listOrganName;
        this.listDatasetId = listDatasetId;
        this.listIsResolve = listIsResolve;
        this.listEveryTimeResolve = listEveryTimeResolve;
        this.listEnableSSear = listEnableSSear;
        this.listEnableCSear = listEnableCSear;
        this.listTheme = listTheme;
        this.listCustServerRenderer = listCustServerRenderer;
        this.listCustRefJs = listCustRefJs;
        this.listCustClientRenderer = listCustClientRenderer;
        this.listCustDesc = listCustDesc;
    }

    public ListResourceEntity() {
        super();
    }

    public String getListId() {
        return listId;
    }

    public void setListId(String listId) {
        this.listId = listId == null ? null : listId.trim();
    }

    public String getListCode() {
        return listCode;
    }

    public void setListCode(String listCode) {
        this.listCode = listCode == null ? null : listCode.trim();
    }

    public String getListName() {
        return listName;
    }

    public void setListName(String listName) {
        this.listName = listName == null ? null : listName.trim();
    }

    public String getListSingleName() {
        return listSingleName;
    }

    public void setListSingleName(String listSingleName) {
        this.listSingleName = listSingleName == null ? null : listSingleName.trim();
    }

    public Date getListCreateTime() {
        return listCreateTime;
    }

    public void setListCreateTime(Date listCreateTime) {
        this.listCreateTime = listCreateTime;
    }

    public String getListCreater() {
        return listCreater;
    }

    public void setListCreater(String listCreater) {
        this.listCreater = listCreater == null ? null : listCreater.trim();
    }

    public Date getListUpdateTime() {
        return listUpdateTime;
    }

    public void setListUpdateTime(Date listUpdateTime) {
        this.listUpdateTime = listUpdateTime;
    }

    public String getListUpdater() {
        return listUpdater;
    }

    public void setListUpdater(String listUpdater) {
        this.listUpdater = listUpdater == null ? null : listUpdater.trim();
    }

    public String getListType() {
        return listType;
    }

    public void setListType(String listType) {
        this.listType = listType == null ? null : listType.trim();
    }

    public String getListIssystem() {
        return listIssystem;
    }

    public void setListIssystem(String listIssystem) {
        this.listIssystem = listIssystem == null ? null : listIssystem.trim();
    }

    public Integer getListOrderNum() {
        return listOrderNum;
    }

    public void setListOrderNum(Integer listOrderNum) {
        this.listOrderNum = listOrderNum;
    }

    public String getListDesc() {
        return listDesc;
    }

    public void setListDesc(String listDesc) {
        this.listDesc = listDesc == null ? null : listDesc.trim();
    }

    public String getListModuleId() {
        return listModuleId;
    }

    public void setListModuleId(String listModuleId) {
        this.listModuleId = listModuleId == null ? null : listModuleId.trim();
    }

    public String getListStatus() {
        return listStatus;
    }

    public void setListStatus(String listStatus) {
        this.listStatus = listStatus == null ? null : listStatus.trim();
    }

    public String getListOrganId() {
        return listOrganId;
    }

    public void setListOrganId(String listOrganId) {
        this.listOrganId = listOrganId == null ? null : listOrganId.trim();
    }

    public String getListOrganName() {
        return listOrganName;
    }

    public void setListOrganName(String listOrganName) {
        this.listOrganName = listOrganName == null ? null : listOrganName.trim();
    }

    public String getListDatasetId() {
        return listDatasetId;
    }

    public void setListDatasetId(String listDatasetId) {
        this.listDatasetId = listDatasetId == null ? null : listDatasetId.trim();
    }

    public String getListIsResolve() {
        return listIsResolve;
    }

    public void setListIsResolve(String listIsResolve) {
        this.listIsResolve = listIsResolve == null ? null : listIsResolve.trim();
    }

    public String getListEveryTimeResolve() {
        return listEveryTimeResolve;
    }

    public void setListEveryTimeResolve(String listEveryTimeResolve) {
        this.listEveryTimeResolve = listEveryTimeResolve == null ? null : listEveryTimeResolve.trim();
    }

    public String getListEnableSSear() {
        return listEnableSSear;
    }

    public void setListEnableSSear(String listEnableSSear) {
        this.listEnableSSear = listEnableSSear == null ? null : listEnableSSear.trim();
    }

    public String getListEnableCSear() {
        return listEnableCSear;
    }

    public void setListEnableCSear(String listEnableCSear) {
        this.listEnableCSear = listEnableCSear == null ? null : listEnableCSear.trim();
    }

    public String getListTheme() {
        return listTheme;
    }

    public void setListTheme(String listTheme) {
        this.listTheme = listTheme == null ? null : listTheme.trim();
    }

    public String getListCustServerRenderer() {
        return listCustServerRenderer;
    }

    public void setListCustServerRenderer(String listCustServerRenderer) {
        this.listCustServerRenderer = listCustServerRenderer == null ? null : listCustServerRenderer.trim();
    }

    public String getListCustRefJs() {
        return listCustRefJs;
    }

    public void setListCustRefJs(String listCustRefJs) {
        this.listCustRefJs = listCustRefJs == null ? null : listCustRefJs.trim();
    }

    public String getListCustClientRenderer() {
        return listCustClientRenderer;
    }

    public void setListCustClientRenderer(String listCustClientRenderer) {
        this.listCustClientRenderer = listCustClientRenderer == null ? null : listCustClientRenderer.trim();
    }

    public String getListCustDesc() {
        return listCustDesc;
    }

    public void setListCustDesc(String listCustDesc) {
        this.listCustDesc = listCustDesc == null ? null : listCustDesc.trim();
    }
}