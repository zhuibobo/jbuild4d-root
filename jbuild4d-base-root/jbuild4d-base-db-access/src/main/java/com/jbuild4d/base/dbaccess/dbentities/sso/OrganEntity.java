package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_organ
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class OrganEntity {
    //ORGAN_ID:
    @DBKeyField
    private String organId;

    //ORGAN_NAME:组织机构名称
    private String organName;

    //ORGAN_SHORT_NAME:组织机构简称
    private String organShortName;

    //ORGAN_NO:组织机构号码
    private String organNo;

    //ORGAN_CODE:组织机构编号
    private String organCode;

    //ORGAN_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date organCreateTime;

    //ORGAN_PHONE:联系电话
    private String organPhone;

    //ORGAN_POST:邮政编码
    private String organPost;

    //ORGAN_TYPE_VALUE:组织机构类型,关联TB4D_ORGAN_TYPE表
    private String organTypeValue;

    //ORGAN_ADDRESS:组织机构地址
    private String organAddress;

    //ORGAN_CONTACTS:联系人
    private String organContacts;

    //ORGAN_CONTACTS_MOBILE:联系人电话
    private String organContactsMobile;

    //ORGAN_WEB_SITE:站点地址
    private String organWebSite;

    //ORGAN_FAX:传真号码
    private String organFax;

    //ORGAN_CHILD_COUNT:子节点数量
    private Integer organChildCount;

    //ORGAN_IS_VIRTUAL:是否虚拟
    private String organIsVirtual;

    //ORGAN_ORDER_NUM:排序号
    private Integer organOrderNum;

    //ORGAN_PARENT_ID:父节点ID
    private String organParentId;

    //ORGAN_PARENT_ID_LIST:父节点列表
    private String organParentIdList;

    //ORGAN_STATUS:状态:启用,禁用
    private String organStatus;

    //ORGAN_CREATER_ORG_ID:创建组织者ID
    private String organCreaterOrgId;

    //ORGAN_MAIN_IMAGE_ID:主题Logo,关联到TB4D_FILE_INFO表的FILE_ID
    private String organMainImageId;

    //ORGAN_DESC:组织机构备注
    private String organDesc;

    public OrganEntity(String organId, String organName, String organShortName, String organNo, String organCode, Date organCreateTime, String organPhone, String organPost, String organTypeValue, String organAddress, String organContacts, String organContactsMobile, String organWebSite, String organFax, Integer organChildCount, String organIsVirtual, Integer organOrderNum, String organParentId, String organParentIdList, String organStatus, String organCreaterOrgId, String organMainImageId, String organDesc) {
        this.organId = organId;
        this.organName = organName;
        this.organShortName = organShortName;
        this.organNo = organNo;
        this.organCode = organCode;
        this.organCreateTime = organCreateTime;
        this.organPhone = organPhone;
        this.organPost = organPost;
        this.organTypeValue = organTypeValue;
        this.organAddress = organAddress;
        this.organContacts = organContacts;
        this.organContactsMobile = organContactsMobile;
        this.organWebSite = organWebSite;
        this.organFax = organFax;
        this.organChildCount = organChildCount;
        this.organIsVirtual = organIsVirtual;
        this.organOrderNum = organOrderNum;
        this.organParentId = organParentId;
        this.organParentIdList = organParentIdList;
        this.organStatus = organStatus;
        this.organCreaterOrgId = organCreaterOrgId;
        this.organMainImageId = organMainImageId;
        this.organDesc = organDesc;
    }

    public OrganEntity() {
        super();
    }

    public String getOrganId() {
        return organId;
    }

    public void setOrganId(String organId) {
        this.organId = organId == null ? null : organId.trim();
    }

    public String getOrganName() {
        return organName;
    }

    public void setOrganName(String organName) {
        this.organName = organName == null ? null : organName.trim();
    }

    public String getOrganShortName() {
        return organShortName;
    }

    public void setOrganShortName(String organShortName) {
        this.organShortName = organShortName == null ? null : organShortName.trim();
    }

    public String getOrganNo() {
        return organNo;
    }

    public void setOrganNo(String organNo) {
        this.organNo = organNo == null ? null : organNo.trim();
    }

    public String getOrganCode() {
        return organCode;
    }

    public void setOrganCode(String organCode) {
        this.organCode = organCode == null ? null : organCode.trim();
    }

    public Date getOrganCreateTime() {
        return organCreateTime;
    }

    public void setOrganCreateTime(Date organCreateTime) {
        this.organCreateTime = organCreateTime;
    }

    public String getOrganPhone() {
        return organPhone;
    }

    public void setOrganPhone(String organPhone) {
        this.organPhone = organPhone == null ? null : organPhone.trim();
    }

    public String getOrganPost() {
        return organPost;
    }

    public void setOrganPost(String organPost) {
        this.organPost = organPost == null ? null : organPost.trim();
    }

    public String getOrganTypeValue() {
        return organTypeValue;
    }

    public void setOrganTypeValue(String organTypeValue) {
        this.organTypeValue = organTypeValue == null ? null : organTypeValue.trim();
    }

    public String getOrganAddress() {
        return organAddress;
    }

    public void setOrganAddress(String organAddress) {
        this.organAddress = organAddress == null ? null : organAddress.trim();
    }

    public String getOrganContacts() {
        return organContacts;
    }

    public void setOrganContacts(String organContacts) {
        this.organContacts = organContacts == null ? null : organContacts.trim();
    }

    public String getOrganContactsMobile() {
        return organContactsMobile;
    }

    public void setOrganContactsMobile(String organContactsMobile) {
        this.organContactsMobile = organContactsMobile == null ? null : organContactsMobile.trim();
    }

    public String getOrganWebSite() {
        return organWebSite;
    }

    public void setOrganWebSite(String organWebSite) {
        this.organWebSite = organWebSite == null ? null : organWebSite.trim();
    }

    public String getOrganFax() {
        return organFax;
    }

    public void setOrganFax(String organFax) {
        this.organFax = organFax == null ? null : organFax.trim();
    }

    public Integer getOrganChildCount() {
        return organChildCount;
    }

    public void setOrganChildCount(Integer organChildCount) {
        this.organChildCount = organChildCount;
    }

    public String getOrganIsVirtual() {
        return organIsVirtual;
    }

    public void setOrganIsVirtual(String organIsVirtual) {
        this.organIsVirtual = organIsVirtual == null ? null : organIsVirtual.trim();
    }

    public Integer getOrganOrderNum() {
        return organOrderNum;
    }

    public void setOrganOrderNum(Integer organOrderNum) {
        this.organOrderNum = organOrderNum;
    }

    public String getOrganParentId() {
        return organParentId;
    }

    public void setOrganParentId(String organParentId) {
        this.organParentId = organParentId == null ? null : organParentId.trim();
    }

    public String getOrganParentIdList() {
        return organParentIdList;
    }

    public void setOrganParentIdList(String organParentIdList) {
        this.organParentIdList = organParentIdList == null ? null : organParentIdList.trim();
    }

    public String getOrganStatus() {
        return organStatus;
    }

    public void setOrganStatus(String organStatus) {
        this.organStatus = organStatus == null ? null : organStatus.trim();
    }

    public String getOrganCreaterOrgId() {
        return organCreaterOrgId;
    }

    public void setOrganCreaterOrgId(String organCreaterOrgId) {
        this.organCreaterOrgId = organCreaterOrgId == null ? null : organCreaterOrgId.trim();
    }

    public String getOrganMainImageId() {
        return organMainImageId;
    }

    public void setOrganMainImageId(String organMainImageId) {
        this.organMainImageId = organMainImageId == null ? null : organMainImageId.trim();
    }

    public String getOrganDesc() {
        return organDesc;
    }

    public void setOrganDesc(String organDesc) {
        this.organDesc = organDesc == null ? null : organDesc.trim();
    }
}