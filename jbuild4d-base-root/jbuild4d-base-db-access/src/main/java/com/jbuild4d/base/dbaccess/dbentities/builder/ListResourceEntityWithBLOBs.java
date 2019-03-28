package com.jbuild4d.base.dbaccess.dbentities.builder;

import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table TBUILD_LIST_RESOURCE
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class ListResourceEntityWithBLOBs extends ListResourceEntity {
    //LIST_HTML_SOURCE
    private String listHtmlSource;

    //LIST_HTML_RESOLVE
    private String listHtmlResolve;

    //LIST_JS_CONTENT
    private String listJsContent;

    //LIST_CONFIG_CONTENT
    private String listConfigContent;

    public ListResourceEntityWithBLOBs(String listId, String listCode, String listName, String listSingleName, Date listCreateTime, String listCreater, Date listUpdateTime, String listUpdater, String listType, String listIssystem, Integer listOrderNum, String listDesc, String listModuleId, String listStatus, String listOrganId, String listOrganName, String listDatasetId, String listEnableSSear, String listEnableCSear, String listHtmlSource, String listHtmlResolve, String listJsContent, String listConfigContent) {
        super(listId, listCode, listName, listSingleName, listCreateTime, listCreater, listUpdateTime, listUpdater, listType, listIssystem, listOrderNum, listDesc, listModuleId, listStatus, listOrganId, listOrganName, listDatasetId, listEnableSSear, listEnableCSear);
        this.listHtmlSource = listHtmlSource;
        this.listHtmlResolve = listHtmlResolve;
        this.listJsContent = listJsContent;
        this.listConfigContent = listConfigContent;
    }

    public ListResourceEntityWithBLOBs() {
        super();
    }

    public String getListHtmlSource() {
        return listHtmlSource;
    }

    public void setListHtmlSource(String listHtmlSource) {
        this.listHtmlSource = listHtmlSource == null ? null : listHtmlSource.trim();
    }

    public String getListHtmlResolve() {
        return listHtmlResolve;
    }

    public void setListHtmlResolve(String listHtmlResolve) {
        this.listHtmlResolve = listHtmlResolve == null ? null : listHtmlResolve.trim();
    }

    public String getListJsContent() {
        return listJsContent;
    }

    public void setListJsContent(String listJsContent) {
        this.listJsContent = listJsContent == null ? null : listJsContent.trim();
    }

    public String getListConfigContent() {
        return listConfigContent;
    }

    public void setListConfigContent(String listConfigContent) {
        this.listConfigContent = listConfigContent == null ? null : listConfigContent.trim();
    }
}