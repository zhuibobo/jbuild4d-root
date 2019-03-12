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

    //INTERFACE_CODE:接口类型:默认定义和自定义:eg[LOGIN]
    private String interfaceCode;

    //INTERFACE_NAME:接口名称
    private String interfaceName;

    //INTERFACE_URL:接口地址
    private String interfaceUrl;

    //INTERFACE_PARAS:参数
    private String interfaceParas;

    //INTERFACE_FORMAT:格式化方法
    private String interfaceFormat;

    //INTERFACE_DESC:备注
    private String interfaceDesc;

    //INTERFACE_ORDER_NUM:排序号
    private Integer interfaceOrderNum;

    //INTERFACE_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date interfaceCreateTime;

    //INTERFACE_STATUS:状态
    private String interfaceStatus;

    //INTERFACE_CREATER_ID:创建者的ID
    private String interfaceCreaterId;

    //INTERFACE_ORGAN_ID:创建组织ID
    private String interfaceOrganId;

    public SsoAppInterfaceEntity(String interfaceId, String interfaceBelongAppId, String interfaceCode, String interfaceName, String interfaceUrl, String interfaceParas, String interfaceFormat, String interfaceDesc, Integer interfaceOrderNum, Date interfaceCreateTime, String interfaceStatus, String interfaceCreaterId, String interfaceOrganId) {
        this.interfaceId = interfaceId;
        this.interfaceBelongAppId = interfaceBelongAppId;
        this.interfaceCode = interfaceCode;
        this.interfaceName = interfaceName;
        this.interfaceUrl = interfaceUrl;
        this.interfaceParas = interfaceParas;
        this.interfaceFormat = interfaceFormat;
        this.interfaceDesc = interfaceDesc;
        this.interfaceOrderNum = interfaceOrderNum;
        this.interfaceCreateTime = interfaceCreateTime;
        this.interfaceStatus = interfaceStatus;
        this.interfaceCreaterId = interfaceCreaterId;
        this.interfaceOrganId = interfaceOrganId;
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

    public String getInterfaceCode() {
        return interfaceCode;
    }

    public void setInterfaceCode(String interfaceCode) {
        this.interfaceCode = interfaceCode == null ? null : interfaceCode.trim();
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

    public String getInterfaceParas() {
        return interfaceParas;
    }

    public void setInterfaceParas(String interfaceParas) {
        this.interfaceParas = interfaceParas == null ? null : interfaceParas.trim();
    }

    public String getInterfaceFormat() {
        return interfaceFormat;
    }

    public void setInterfaceFormat(String interfaceFormat) {
        this.interfaceFormat = interfaceFormat == null ? null : interfaceFormat.trim();
    }

    public String getInterfaceDesc() {
        return interfaceDesc;
    }

    public void setInterfaceDesc(String interfaceDesc) {
        this.interfaceDesc = interfaceDesc == null ? null : interfaceDesc.trim();
    }

    public Integer getInterfaceOrderNum() {
        return interfaceOrderNum;
    }

    public void setInterfaceOrderNum(Integer interfaceOrderNum) {
        this.interfaceOrderNum = interfaceOrderNum;
    }

    public Date getInterfaceCreateTime() {
        return interfaceCreateTime;
    }

    public void setInterfaceCreateTime(Date interfaceCreateTime) {
        this.interfaceCreateTime = interfaceCreateTime;
    }

    public String getInterfaceStatus() {
        return interfaceStatus;
    }

    public void setInterfaceStatus(String interfaceStatus) {
        this.interfaceStatus = interfaceStatus == null ? null : interfaceStatus.trim();
    }

    public String getInterfaceCreaterId() {
        return interfaceCreaterId;
    }

    public void setInterfaceCreaterId(String interfaceCreaterId) {
        this.interfaceCreaterId = interfaceCreaterId == null ? null : interfaceCreaterId.trim();
    }

    public String getInterfaceOrganId() {
        return interfaceOrganId;
    }

    public void setInterfaceOrganId(String interfaceOrganId) {
        this.interfaceOrganId = interfaceOrganId == null ? null : interfaceOrganId.trim();
    }
}