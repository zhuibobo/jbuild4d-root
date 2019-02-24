package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_organ_type
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class OrganTypeEntity {
    //ORGAN_TYPE_ID:
    @DBKeyField
    private String organTypeId;

    //ORGAN_TYPE_VALUE:组织机构编码值,唯一,与组织机构表关联
    private String organTypeValue;

    //ORGAN_TYPE_NAME:组织机构类型名称
    private String organTypeName;

    //ORGAN_TYPE_DESC:组织机构类型备注
    private String organTypeDesc;

    public OrganTypeEntity(String organTypeId, String organTypeValue, String organTypeName, String organTypeDesc) {
        this.organTypeId = organTypeId;
        this.organTypeValue = organTypeValue;
        this.organTypeName = organTypeName;
        this.organTypeDesc = organTypeDesc;
    }

    public OrganTypeEntity() {
        super();
    }

    public String getOrganTypeId() {
        return organTypeId;
    }

    public void setOrganTypeId(String organTypeId) {
        this.organTypeId = organTypeId == null ? null : organTypeId.trim();
    }

    public String getOrganTypeValue() {
        return organTypeValue;
    }

    public void setOrganTypeValue(String organTypeValue) {
        this.organTypeValue = organTypeValue == null ? null : organTypeValue.trim();
    }

    public String getOrganTypeName() {
        return organTypeName;
    }

    public void setOrganTypeName(String organTypeName) {
        this.organTypeName = organTypeName == null ? null : organTypeName.trim();
    }

    public String getOrganTypeDesc() {
        return organTypeDesc;
    }

    public void setOrganTypeDesc(String organTypeDesc) {
        this.organTypeDesc = organTypeDesc == null ? null : organTypeDesc.trim();
    }
}