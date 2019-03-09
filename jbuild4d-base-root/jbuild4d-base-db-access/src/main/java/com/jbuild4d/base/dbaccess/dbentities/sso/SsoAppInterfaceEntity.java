package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_sso_app_interface
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class SsoAppInterfaceEntity {
    //INTERFACE_ID:
    @DBKeyField
    private String interfaceId;

    //INTERFACE_BELONG_APP_ID:所属系统ID
    private String interfaceBelongAppId;

    //INTERFACE_TYPE_NAME:接口类型:默认定义和自定义:eg[登录接口]
    private String interfaceTypeName;

    //INTERFACE_NAME:接口名称
    private String interfaceName;

    //INTERFACE_URL:接口地址
    private String interfaceUrl;

    //INTERFACE_URL_PARAS:参数
    private String interfaceUrlParas;

    //INTERFACE_URL_FORMAT:格式化方法
    private String interfaceUrlFormat;

    //INTERFACE_URL_DESC:备注
    private String interfaceUrlDesc;

    //INTERFACE_URL_ORDER_NUM:排序号
    private Integer interfaceUrlOrderNum;

    //INTERFACE_URL_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date interfaceUrlCreateTime;

    //INTERFACE_URL_STATUS:状态
    private String interfaceUrlStatus;

    //INTERFACE_URL_CREATER_ID:创建者的ID
    private String interfaceUrlCreaterId;

    //INTERFACE_URL_ORGAN_ID:创建组织ID
    private String interfaceUrlOrganId;

    public SsoAppInterfaceEntity(String interfaceId, String interfaceBelongAppId, String interfaceTypeName, String interfaceName, String interfaceUrl, String interfaceUrlParas, String interfaceUrlFormat, String interfaceUrlDesc, Integer interfaceUrlOrderNum, Date interfaceUrlCreateTime, String interfaceUrlStatus, String interfaceUrlCreaterId, String interfaceUrlOrganId) {
        this.interfaceId = interfaceId;
        this.interfaceBelongAppId = interfaceBelongAppId;
        this.interfaceTypeName = interfaceTypeName;
        this.interfaceName = interfaceName;
        this.interfaceUrl = interfaceUrl;
        this.interfaceUrlParas = interfaceUrlParas;
        this.interfaceUrlFormat = interfaceUrlFormat;
        this.interfaceUrlDesc = interfaceUrlDesc;
        this.interfaceUrlOrderNum = interfaceUrlOrderNum;
        this.interfaceUrlCreateTime = interfaceUrlCreateTime;
        this.interfaceUrlStatus = interfaceUrlStatus;
        this.interfaceUrlCreaterId = interfaceUrlCreaterId;
        this.interfaceUrlOrganId = interfaceUrlOrganId;
    }

    public SsoAppInterfaceEntity() {
        super();
    }

    public String getInterfaceId() {
        return interfaceId;
    }

    public void setInterfaceId(String interfaceId) {
        this.interfaceId = interfaceId == null ? null : interfaceId.trim();
    }

    public String getInterfaceBelongAppId() {
        return interfaceBelongAppId;
    }

    public void setInterfaceBelongAppId(String interfaceBelongAppId) {
        this.interfaceBelongAppId = interfaceBelongAppId == null ? null : interfaceBelongAppId.trim();
    }

    public String getInterfaceTypeName() {
        return interfaceTypeName;
    }

    public void setInterfaceTypeName(String interfaceTypeName) {
        this.interfaceTypeName = interfaceTypeName == null ? null : interfaceTypeName.trim();
    }

    public String getInterfaceName() {
        return interfaceName;
    }

    public void setInterfaceName(String interfaceName) {
        this.interfaceName = interfaceName == null ? null : interfaceName.trim();
    }

    public String getInterfaceUrl() {
        return interfaceUrl;
    }

    public void setInterfaceUrl(String interfaceUrl) {
        this.interfaceUrl = interfaceUrl == null ? null : interfaceUrl.trim();
    }

    public String getInterfaceUrlParas() {
        return interfaceUrlParas;
    }

    public void setInterfaceUrlParas(String interfaceUrlParas) {
        this.interfaceUrlParas = interfaceUrlParas == null ? null : interfaceUrlParas.trim();
    }

    public String getInterfaceUrlFormat() {
        return interfaceUrlFormat;
    }

    public void setInterfaceUrlFormat(String interfaceUrlFormat) {
        this.interfaceUrlFormat = interfaceUrlFormat == null ? null : interfaceUrlFormat.trim();
    }

    public String getInterfaceUrlDesc() {
        return interfaceUrlDesc;
    }

    public void setInterfaceUrlDesc(String interfaceUrlDesc) {
        this.interfaceUrlDesc = interfaceUrlDesc == null ? null : interfaceUrlDesc.trim();
    }

    public Integer getInterfaceUrlOrderNum() {
        return interfaceUrlOrderNum;
    }

    public void setInterfaceUrlOrderNum(Integer interfaceUrlOrderNum) {
        this.interfaceUrlOrderNum = interfaceUrlOrderNum;
    }

    public Date getInterfaceUrlCreateTime() {
        return interfaceUrlCreateTime;
    }

    public void setInterfaceUrlCreateTime(Date interfaceUrlCreateTime) {
        this.interfaceUrlCreateTime = interfaceUrlCreateTime;
    }

    public String getInterfaceUrlStatus() {
        return interfaceUrlStatus;
    }

    public void setInterfaceUrlStatus(String interfaceUrlStatus) {
        this.interfaceUrlStatus = interfaceUrlStatus == null ? null : interfaceUrlStatus.trim();
    }

    public String getInterfaceUrlCreaterId() {
        return interfaceUrlCreaterId;
    }

    public void setInterfaceUrlCreaterId(String interfaceUrlCreaterId) {
        this.interfaceUrlCreaterId = interfaceUrlCreaterId == null ? null : interfaceUrlCreaterId.trim();
    }

    public String getInterfaceUrlOrganId() {
        return interfaceUrlOrganId;
    }

    public void setInterfaceUrlOrganId(String interfaceUrlOrganId) {
        this.interfaceUrlOrganId = interfaceUrlOrganId == null ? null : interfaceUrlOrganId.trim();
    }
}