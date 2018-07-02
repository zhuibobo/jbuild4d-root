package com.jbuild4d.base.dbaccess.dbentities;

import java.util.Date;

public class MenuEntity {
    private String folderId;

    private String folderName;

    private String folderText;

    private String folderValue;

    private String folderType;

    private Long isExpand;

    private Long isSystem;

    private String leftUrl;

    private String leftUrlPara;

    private String rightUrl;

    private String rightUrlPara;

    private Long orderId;

    private String organId;

    private String parentId;

    private String parentIdList;

    private Long shareType;

    private String tag;

    private Long target;

    private String updater;

    private String useOrgan;

    private String useOrganId;

    private String useOrganType;

    private String useOrganTypeId;

    private String iconClassName;

    private String hoverClassName;

    private String selectedClassName;

    private Long childCount;

    private Date createTime;

    private String creator;

    private String description;

    private Date updateTime;

    private String jsExpression;

    public MenuEntity(String folderId, String folderName, String folderText, String folderValue, String folderType, Long isExpand, Long isSystem, String leftUrl, String leftUrlPara, String rightUrl, String rightUrlPara, Long orderId, String organId, String parentId, String parentIdList, Long shareType, String tag, Long target, String updater, String useOrgan, String useOrganId, String useOrganType, String useOrganTypeId, String iconClassName, String hoverClassName, String selectedClassName, Long childCount, Date createTime, String creator, String description, Date updateTime, String jsExpression) {
        this.folderId = folderId;
        this.folderName = folderName;
        this.folderText = folderText;
        this.folderValue = folderValue;
        this.folderType = folderType;
        this.isExpand = isExpand;
        this.isSystem = isSystem;
        this.leftUrl = leftUrl;
        this.leftUrlPara = leftUrlPara;
        this.rightUrl = rightUrl;
        this.rightUrlPara = rightUrlPara;
        this.orderId = orderId;
        this.organId = organId;
        this.parentId = parentId;
        this.parentIdList = parentIdList;
        this.shareType = shareType;
        this.tag = tag;
        this.target = target;
        this.updater = updater;
        this.useOrgan = useOrgan;
        this.useOrganId = useOrganId;
        this.useOrganType = useOrganType;
        this.useOrganTypeId = useOrganTypeId;
        this.iconClassName = iconClassName;
        this.hoverClassName = hoverClassName;
        this.selectedClassName = selectedClassName;
        this.childCount = childCount;
        this.createTime = createTime;
        this.creator = creator;
        this.description = description;
        this.updateTime = updateTime;
        this.jsExpression = jsExpression;
    }

    public MenuEntity() {
        super();
    }

    public String getFolderId() {
        return folderId;
    }

    public void setFolderId(String folderId) {
        this.folderId = folderId == null ? null : folderId.trim();
    }

    public String getFolderName() {
        return folderName;
    }

    public void setFolderName(String folderName) {
        this.folderName = folderName == null ? null : folderName.trim();
    }

    public String getFolderText() {
        return folderText;
    }

    public void setFolderText(String folderText) {
        this.folderText = folderText == null ? null : folderText.trim();
    }

    public String getFolderValue() {
        return folderValue;
    }

    public void setFolderValue(String folderValue) {
        this.folderValue = folderValue == null ? null : folderValue.trim();
    }

    public String getFolderType() {
        return folderType;
    }

    public void setFolderType(String folderType) {
        this.folderType = folderType == null ? null : folderType.trim();
    }

    public Long getIsExpand() {
        return isExpand;
    }

    public void setIsExpand(Long isExpand) {
        this.isExpand = isExpand;
    }

    public Long getIsSystem() {
        return isSystem;
    }

    public void setIsSystem(Long isSystem) {
        this.isSystem = isSystem;
    }

    public String getLeftUrl() {
        return leftUrl;
    }

    public void setLeftUrl(String leftUrl) {
        this.leftUrl = leftUrl == null ? null : leftUrl.trim();
    }

    public String getLeftUrlPara() {
        return leftUrlPara;
    }

    public void setLeftUrlPara(String leftUrlPara) {
        this.leftUrlPara = leftUrlPara == null ? null : leftUrlPara.trim();
    }

    public String getRightUrl() {
        return rightUrl;
    }

    public void setRightUrl(String rightUrl) {
        this.rightUrl = rightUrl == null ? null : rightUrl.trim();
    }

    public String getRightUrlPara() {
        return rightUrlPara;
    }

    public void setRightUrlPara(String rightUrlPara) {
        this.rightUrlPara = rightUrlPara == null ? null : rightUrlPara.trim();
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrganId() {
        return organId;
    }

    public void setOrganId(String organId) {
        this.organId = organId == null ? null : organId.trim();
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId == null ? null : parentId.trim();
    }

    public String getParentIdList() {
        return parentIdList;
    }

    public void setParentIdList(String parentIdList) {
        this.parentIdList = parentIdList == null ? null : parentIdList.trim();
    }

    public Long getShareType() {
        return shareType;
    }

    public void setShareType(Long shareType) {
        this.shareType = shareType;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag == null ? null : tag.trim();
    }

    public Long getTarget() {
        return target;
    }

    public void setTarget(Long target) {
        this.target = target;
    }

    public String getUpdater() {
        return updater;
    }

    public void setUpdater(String updater) {
        this.updater = updater == null ? null : updater.trim();
    }

    public String getUseOrgan() {
        return useOrgan;
    }

    public void setUseOrgan(String useOrgan) {
        this.useOrgan = useOrgan == null ? null : useOrgan.trim();
    }

    public String getUseOrganId() {
        return useOrganId;
    }

    public void setUseOrganId(String useOrganId) {
        this.useOrganId = useOrganId == null ? null : useOrganId.trim();
    }

    public String getUseOrganType() {
        return useOrganType;
    }

    public void setUseOrganType(String useOrganType) {
        this.useOrganType = useOrganType == null ? null : useOrganType.trim();
    }

    public String getUseOrganTypeId() {
        return useOrganTypeId;
    }

    public void setUseOrganTypeId(String useOrganTypeId) {
        this.useOrganTypeId = useOrganTypeId == null ? null : useOrganTypeId.trim();
    }

    public String getIconClassName() {
        return iconClassName;
    }

    public void setIconClassName(String iconClassName) {
        this.iconClassName = iconClassName == null ? null : iconClassName.trim();
    }

    public String getHoverClassName() {
        return hoverClassName;
    }

    public void setHoverClassName(String hoverClassName) {
        this.hoverClassName = hoverClassName == null ? null : hoverClassName.trim();
    }

    public String getSelectedClassName() {
        return selectedClassName;
    }

    public void setSelectedClassName(String selectedClassName) {
        this.selectedClassName = selectedClassName == null ? null : selectedClassName.trim();
    }

    public Long getChildCount() {
        return childCount;
    }

    public void setChildCount(Long childCount) {
        this.childCount = childCount;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator == null ? null : creator.trim();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description == null ? null : description.trim();
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public String getJsExpression() {
        return jsExpression;
    }

    public void setJsExpression(String jsExpression) {
        this.jsExpression = jsExpression == null ? null : jsExpression.trim();
    }
}