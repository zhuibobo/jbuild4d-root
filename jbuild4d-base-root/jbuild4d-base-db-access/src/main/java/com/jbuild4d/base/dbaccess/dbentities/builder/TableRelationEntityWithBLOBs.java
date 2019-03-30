package com.jbuild4d.base.dbaccess.dbentities.builder;

import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tbuild_table_relation
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class TableRelationEntityWithBLOBs extends TableRelationEntity {
    //RELATION_CONTENT:表关系的Json描述:抽取元素的组要属性进行存储
    private String relationContent;

    //RELATION_DIAGRAM_JSON:画布的原始Json:用于生成图片
    private String relationDiagramJson;

    public TableRelationEntityWithBLOBs(String relationId, String relationGroupId, String relationName, String relationUserId, String relationUserName, Integer relationOrderNum, Date relationCreateTime, String relationDesc, String relationStatus, String relationContent, String relationDiagramJson) {
        super(relationId, relationGroupId, relationName, relationUserId, relationUserName, relationOrderNum, relationCreateTime, relationDesc, relationStatus);
        this.relationContent = relationContent;
        this.relationDiagramJson = relationDiagramJson;
    }

    public TableRelationEntityWithBLOBs() {
        super();
    }

    public String getRelationContent() {
        return relationContent;
    }

    public void setRelationContent(String relationContent) {
        this.relationContent = relationContent == null ? null : relationContent.trim();
    }

    public String getRelationDiagramJson() {
        return relationDiagramJson;
    }

    public void setRelationDiagramJson(String relationDiagramJson) {
        this.relationDiagramJson = relationDiagramJson == null ? null : relationDiagramJson.trim();
    }
}