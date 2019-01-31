package com.jbuild4d.base.dbaccess.dbentities.builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated by MyBatis Generator.
 * This class corresponds to the database table tb4d_flow_model
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class FlowModelEntity {
    //MODEL_ID
    @DBKeyField
    private String modelId;

    //MODEL_MODULE_ID
    private String modelModuleId;

    //MODEL_GROUP_ID
    private String modelGroupId;

    //MODEL_NAME
    private String modelName;

    //MODEL_CREATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date modelCreateTime;

    //MODEL_CREATER
    private String modelCreater;

    //MODEL_UPDATE_TIME
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date modelUpdateTime;

    //MODEL_UPDATER
    private String modelUpdater;

    //MODEL_DESC
    private String modelDesc;

    //MODEL_STATUS
    private String modelStatus;

    //MODEL_ORDER_NUM
    private Integer modelOrderNum;

    //MODEL_DEPLOYMENT_ID
    private String modelDeploymentId;

    //MODEL_START_KEY
    private String modelStartKey;

    //MODEL_RESOURCE_NAME
    private String modelResourceName;

    //MODEL_FROM_TYPE
    private String modelFromType;

    public FlowModelEntity(String modelId, String modelModuleId, String modelGroupId, String modelName, Date modelCreateTime, String modelCreater, Date modelUpdateTime, String modelUpdater, String modelDesc, String modelStatus, Integer modelOrderNum, String modelDeploymentId, String modelStartKey, String modelResourceName, String modelFromType) {
        this.modelId = modelId;
        this.modelModuleId = modelModuleId;
        this.modelGroupId = modelGroupId;
        this.modelName = modelName;
        this.modelCreateTime = modelCreateTime;
        this.modelCreater = modelCreater;
        this.modelUpdateTime = modelUpdateTime;
        this.modelUpdater = modelUpdater;
        this.modelDesc = modelDesc;
        this.modelStatus = modelStatus;
        this.modelOrderNum = modelOrderNum;
        this.modelDeploymentId = modelDeploymentId;
        this.modelStartKey = modelStartKey;
        this.modelResourceName = modelResourceName;
        this.modelFromType = modelFromType;
    }

    public FlowModelEntity() {
        super();
    }

    public String getModelId() {
        return modelId;
    }

    public void setModelId(String modelId) {
        this.modelId = modelId == null ? null : modelId.trim();
    }

    public String getModelModuleId() {
        return modelModuleId;
    }

    public void setModelModuleId(String modelModuleId) {
        this.modelModuleId = modelModuleId == null ? null : modelModuleId.trim();
    }

    public String getModelGroupId() {
        return modelGroupId;
    }

    public void setModelGroupId(String modelGroupId) {
        this.modelGroupId = modelGroupId == null ? null : modelGroupId.trim();
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName == null ? null : modelName.trim();
    }

    public Date getModelCreateTime() {
        return modelCreateTime;
    }

    public void setModelCreateTime(Date modelCreateTime) {
        this.modelCreateTime = modelCreateTime;
    }

    public String getModelCreater() {
        return modelCreater;
    }

    public void setModelCreater(String modelCreater) {
        this.modelCreater = modelCreater == null ? null : modelCreater.trim();
    }

    public Date getModelUpdateTime() {
        return modelUpdateTime;
    }

    public void setModelUpdateTime(Date modelUpdateTime) {
        this.modelUpdateTime = modelUpdateTime;
    }

    public String getModelUpdater() {
        return modelUpdater;
    }

    public void setModelUpdater(String modelUpdater) {
        this.modelUpdater = modelUpdater == null ? null : modelUpdater.trim();
    }

    public String getModelDesc() {
        return modelDesc;
    }

    public void setModelDesc(String modelDesc) {
        this.modelDesc = modelDesc == null ? null : modelDesc.trim();
    }

    public String getModelStatus() {
        return modelStatus;
    }

    public void setModelStatus(String modelStatus) {
        this.modelStatus = modelStatus == null ? null : modelStatus.trim();
    }

    public Integer getModelOrderNum() {
        return modelOrderNum;
    }

    public void setModelOrderNum(Integer modelOrderNum) {
        this.modelOrderNum = modelOrderNum;
    }

    public String getModelDeploymentId() {
        return modelDeploymentId;
    }

    public void setModelDeploymentId(String modelDeploymentId) {
        this.modelDeploymentId = modelDeploymentId == null ? null : modelDeploymentId.trim();
    }

    public String getModelStartKey() {
        return modelStartKey;
    }

    public void setModelStartKey(String modelStartKey) {
        this.modelStartKey = modelStartKey == null ? null : modelStartKey.trim();
    }

    public String getModelResourceName() {
        return modelResourceName;
    }

    public void setModelResourceName(String modelResourceName) {
        this.modelResourceName = modelResourceName == null ? null : modelResourceName.trim();
    }

    public String getModelFromType() {
        return modelFromType;
    }

    public void setModelFromType(String modelFromType) {
        this.modelFromType = modelFromType == null ? null : modelFromType.trim();
    }
}