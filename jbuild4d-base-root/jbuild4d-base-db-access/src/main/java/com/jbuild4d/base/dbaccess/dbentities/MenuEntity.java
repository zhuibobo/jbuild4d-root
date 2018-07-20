package com.jbuild4d.base.dbaccess.dbentities;

import java.util.Date;

public class MenuEntity {
    private String menuId;

    private String menuName;

    private String menuText;

    private String menuValue;

    private String menuType;

    private String menuUserId;

    private String menuUserName;

    private String menuOrganId;

    private String menuOrganName;

    private String menuIsExpand;

    private String menuIsSystem;

    private String menuLeftUrl;

    private String menuLeftUrlPara;

    private String menuRightUrl;

    private String menuRightUrlPara;

    private Integer menuOrderNum;

    private String menuParentId;

    private String menuParentIdList;

    private String menuTarget;

    private String menuCreator;

    private Date menuCreateTime;

    private String menuUpdater;

    private Date menuUpdateTime;

    private String menuUseOrganName;

    private String menuUseOrganId;

    private String menuUseOrganTypeName;

    private String menuUseOrganTypeId;

    private String menuClassName;

    private String menuClassNameHover;

    private String menuClassNameSelected;

    private Integer menuMenuChildCount;

    private String menuMenuDescription;

    private String menuJsExpression;

    public MenuEntity(String menuId, String menuName, String menuText, String menuValue, String menuType, String menuUserId, String menuUserName, String menuOrganId, String menuOrganName, String menuIsExpand, String menuIsSystem, String menuLeftUrl, String menuLeftUrlPara, String menuRightUrl, String menuRightUrlPara, Integer menuOrderNum, String menuParentId, String menuParentIdList, String menuTarget, String menuCreator, Date menuCreateTime, String menuUpdater, Date menuUpdateTime, String menuUseOrganName, String menuUseOrganId, String menuUseOrganTypeName, String menuUseOrganTypeId, String menuClassName, String menuClassNameHover, String menuClassNameSelected, Integer menuMenuChildCount, String menuMenuDescription, String menuJsExpression) {
        this.menuId = menuId;
        this.menuName = menuName;
        this.menuText = menuText;
        this.menuValue = menuValue;
        this.menuType = menuType;
        this.menuUserId = menuUserId;
        this.menuUserName = menuUserName;
        this.menuOrganId = menuOrganId;
        this.menuOrganName = menuOrganName;
        this.menuIsExpand = menuIsExpand;
        this.menuIsSystem = menuIsSystem;
        this.menuLeftUrl = menuLeftUrl;
        this.menuLeftUrlPara = menuLeftUrlPara;
        this.menuRightUrl = menuRightUrl;
        this.menuRightUrlPara = menuRightUrlPara;
        this.menuOrderNum = menuOrderNum;
        this.menuParentId = menuParentId;
        this.menuParentIdList = menuParentIdList;
        this.menuTarget = menuTarget;
        this.menuCreator = menuCreator;
        this.menuCreateTime = menuCreateTime;
        this.menuUpdater = menuUpdater;
        this.menuUpdateTime = menuUpdateTime;
        this.menuUseOrganName = menuUseOrganName;
        this.menuUseOrganId = menuUseOrganId;
        this.menuUseOrganTypeName = menuUseOrganTypeName;
        this.menuUseOrganTypeId = menuUseOrganTypeId;
        this.menuClassName = menuClassName;
        this.menuClassNameHover = menuClassNameHover;
        this.menuClassNameSelected = menuClassNameSelected;
        this.menuMenuChildCount = menuMenuChildCount;
        this.menuMenuDescription = menuMenuDescription;
        this.menuJsExpression = menuJsExpression;
    }

    public MenuEntity() {
        super();
    }

    public String getMenuId() {
        return menuId;
    }

    public void setMenuId(String menuId) {
        this.menuId = menuId == null ? null : menuId.trim();
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName == null ? null : menuName.trim();
    }

    public String getMenuText() {
        return menuText;
    }

    public void setMenuText(String menuText) {
        this.menuText = menuText == null ? null : menuText.trim();
    }

    public String getMenuValue() {
        return menuValue;
    }

    public void setMenuValue(String menuValue) {
        this.menuValue = menuValue == null ? null : menuValue.trim();
    }

    public String getMenuType() {
        return menuType;
    }

    public void setMenuType(String menuType) {
        this.menuType = menuType == null ? null : menuType.trim();
    }

    public String getMenuUserId() {
        return menuUserId;
    }

    public void setMenuUserId(String menuUserId) {
        this.menuUserId = menuUserId == null ? null : menuUserId.trim();
    }

    public String getMenuUserName() {
        return menuUserName;
    }

    public void setMenuUserName(String menuUserName) {
        this.menuUserName = menuUserName == null ? null : menuUserName.trim();
    }

    public String getMenuOrganId() {
        return menuOrganId;
    }

    public void setMenuOrganId(String menuOrganId) {
        this.menuOrganId = menuOrganId == null ? null : menuOrganId.trim();
    }

    public String getMenuOrganName() {
        return menuOrganName;
    }

    public void setMenuOrganName(String menuOrganName) {
        this.menuOrganName = menuOrganName == null ? null : menuOrganName.trim();
    }

    public String getMenuIsExpand() {
        return menuIsExpand;
    }

    public void setMenuIsExpand(String menuIsExpand) {
        this.menuIsExpand = menuIsExpand == null ? null : menuIsExpand.trim();
    }

    public String getMenuIsSystem() {
        return menuIsSystem;
    }

    public void setMenuIsSystem(String menuIsSystem) {
        this.menuIsSystem = menuIsSystem == null ? null : menuIsSystem.trim();
    }

    public String getMenuLeftUrl() {
        return menuLeftUrl;
    }

    public void setMenuLeftUrl(String menuLeftUrl) {
        this.menuLeftUrl = menuLeftUrl == null ? null : menuLeftUrl.trim();
    }

    public String getMenuLeftUrlPara() {
        return menuLeftUrlPara;
    }

    public void setMenuLeftUrlPara(String menuLeftUrlPara) {
        this.menuLeftUrlPara = menuLeftUrlPara == null ? null : menuLeftUrlPara.trim();
    }

    public String getMenuRightUrl() {
        return menuRightUrl;
    }

    public void setMenuRightUrl(String menuRightUrl) {
        this.menuRightUrl = menuRightUrl == null ? null : menuRightUrl.trim();
    }

    public String getMenuRightUrlPara() {
        return menuRightUrlPara;
    }

    public void setMenuRightUrlPara(String menuRightUrlPara) {
        this.menuRightUrlPara = menuRightUrlPara == null ? null : menuRightUrlPara.trim();
    }

    public Integer getMenuOrderNum() {
        return menuOrderNum;
    }

    public void setMenuOrderNum(Integer menuOrderNum) {
        this.menuOrderNum = menuOrderNum;
    }

    public String getMenuParentId() {
        return menuParentId;
    }

    public void setMenuParentId(String menuParentId) {
        this.menuParentId = menuParentId == null ? null : menuParentId.trim();
    }

    public String getMenuParentIdList() {
        return menuParentIdList;
    }

    public void setMenuParentIdList(String menuParentIdList) {
        this.menuParentIdList = menuParentIdList == null ? null : menuParentIdList.trim();
    }

    public String getMenuTarget() {
        return menuTarget;
    }

    public void setMenuTarget(String menuTarget) {
        this.menuTarget = menuTarget == null ? null : menuTarget.trim();
    }

    public String getMenuCreator() {
        return menuCreator;
    }

    public void setMenuCreator(String menuCreator) {
        this.menuCreator = menuCreator == null ? null : menuCreator.trim();
    }

    public Date getMenuCreateTime() {
        return menuCreateTime;
    }

    public void setMenuCreateTime(Date menuCreateTime) {
        this.menuCreateTime = menuCreateTime;
    }

    public String getMenuUpdater() {
        return menuUpdater;
    }

    public void setMenuUpdater(String menuUpdater) {
        this.menuUpdater = menuUpdater == null ? null : menuUpdater.trim();
    }

    public Date getMenuUpdateTime() {
        return menuUpdateTime;
    }

    public void setMenuUpdateTime(Date menuUpdateTime) {
        this.menuUpdateTime = menuUpdateTime;
    }

    public String getMenuUseOrganName() {
        return menuUseOrganName;
    }

    public void setMenuUseOrganName(String menuUseOrganName) {
        this.menuUseOrganName = menuUseOrganName == null ? null : menuUseOrganName.trim();
    }

    public String getMenuUseOrganId() {
        return menuUseOrganId;
    }

    public void setMenuUseOrganId(String menuUseOrganId) {
        this.menuUseOrganId = menuUseOrganId == null ? null : menuUseOrganId.trim();
    }

    public String getMenuUseOrganTypeName() {
        return menuUseOrganTypeName;
    }

    public void setMenuUseOrganTypeName(String menuUseOrganTypeName) {
        this.menuUseOrganTypeName = menuUseOrganTypeName == null ? null : menuUseOrganTypeName.trim();
    }

    public String getMenuUseOrganTypeId() {
        return menuUseOrganTypeId;
    }

    public void setMenuUseOrganTypeId(String menuUseOrganTypeId) {
        this.menuUseOrganTypeId = menuUseOrganTypeId == null ? null : menuUseOrganTypeId.trim();
    }

    public String getMenuClassName() {
        return menuClassName;
    }

    public void setMenuClassName(String menuClassName) {
        this.menuClassName = menuClassName == null ? null : menuClassName.trim();
    }

    public String getMenuClassNameHover() {
        return menuClassNameHover;
    }

    public void setMenuClassNameHover(String menuClassNameHover) {
        this.menuClassNameHover = menuClassNameHover == null ? null : menuClassNameHover.trim();
    }

    public String getMenuClassNameSelected() {
        return menuClassNameSelected;
    }

    public void setMenuClassNameSelected(String menuClassNameSelected) {
        this.menuClassNameSelected = menuClassNameSelected == null ? null : menuClassNameSelected.trim();
    }

    public Integer getMenuMenuChildCount() {
        return menuMenuChildCount;
    }

    public void setMenuMenuChildCount(Integer menuMenuChildCount) {
        this.menuMenuChildCount = menuMenuChildCount;
    }

    public String getMenuMenuDescription() {
        return menuMenuDescription;
    }

    public void setMenuMenuDescription(String menuMenuDescription) {
        this.menuMenuDescription = menuMenuDescription == null ? null : menuMenuDescription.trim();
    }

    public String getMenuJsExpression() {
        return menuJsExpression;
    }

    public void setMenuJsExpression(String menuJsExpression) {
        this.menuJsExpression = menuJsExpression == null ? null : menuJsExpression.trim();
    }
}