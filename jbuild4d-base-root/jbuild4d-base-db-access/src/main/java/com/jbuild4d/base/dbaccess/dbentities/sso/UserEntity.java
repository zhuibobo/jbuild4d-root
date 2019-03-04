package com.jbuild4d.base.dbaccess.dbentities.sso;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jbuild4d.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4D Creater,Custom By MyBatis Generator.
 * This class corresponds to the database table :tb4d_user
 *
 * @mbg.generated do_not_delete_during_merge
 */
public class UserEntity {
    //USER_ID:
    @DBKeyField
    private String userId;

    //USER_NAME:用户名
    private String userName;

    //USER_ACCOUNT:账号
    private String userAccount;

    //USER_PASSWORD:密码
    private String userPassword;

    //USER_EMAIL:邮件地址
    private String userEmail;

    //USER_PHONE_NUMBER:手机号码
    private String userPhoneNumber;

    //USER_AVATAR_ID:头像ID,关联到TB4D_FILE_INFO表的FILE_ID
    private String userAvatarId;

    //USER_ORGAN_ID:所属组织ID
    private String userOrganId;

    //USER_DESC:用户备注
    private String userDesc;

    //USER_CREATE_TIME:创建时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date userCreateTime;

    //USER_CREATE_USER_ID:创建用户ID
    private String userCreateUserId;

    //USER_STATUS:状态:启用,禁用
    private String userStatus;

    //USER_ORDER_NUM:排序号
    private Integer userOrderNum;

    public UserEntity(String userId, String userName, String userAccount, String userPassword, String userEmail, String userPhoneNumber, String userAvatarId, String userOrganId, String userDesc, Date userCreateTime, String userCreateUserId, String userStatus, Integer userOrderNum) {
        this.userId = userId;
        this.userName = userName;
        this.userAccount = userAccount;
        this.userPassword = userPassword;
        this.userEmail = userEmail;
        this.userPhoneNumber = userPhoneNumber;
        this.userAvatarId = userAvatarId;
        this.userOrganId = userOrganId;
        this.userDesc = userDesc;
        this.userCreateTime = userCreateTime;
        this.userCreateUserId = userCreateUserId;
        this.userStatus = userStatus;
        this.userOrderNum = userOrderNum;
    }

    public UserEntity() {
        super();
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId == null ? null : userId.trim();
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName == null ? null : userName.trim();
    }

    public String getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(String userAccount) {
        this.userAccount = userAccount == null ? null : userAccount.trim();
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword == null ? null : userPassword.trim();
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail == null ? null : userEmail.trim();
    }

    public String getUserPhoneNumber() {
        return userPhoneNumber;
    }

    public void setUserPhoneNumber(String userPhoneNumber) {
        this.userPhoneNumber = userPhoneNumber == null ? null : userPhoneNumber.trim();
    }

    public String getUserAvatarId() {
        return userAvatarId;
    }

    public void setUserAvatarId(String userAvatarId) {
        this.userAvatarId = userAvatarId == null ? null : userAvatarId.trim();
    }

    public String getUserOrganId() {
        return userOrganId;
    }

    public void setUserOrganId(String userOrganId) {
        this.userOrganId = userOrganId == null ? null : userOrganId.trim();
    }

    public String getUserDesc() {
        return userDesc;
    }

    public void setUserDesc(String userDesc) {
        this.userDesc = userDesc == null ? null : userDesc.trim();
    }

    public Date getUserCreateTime() {
        return userCreateTime;
    }

    public void setUserCreateTime(Date userCreateTime) {
        this.userCreateTime = userCreateTime;
    }

    public String getUserCreateUserId() {
        return userCreateUserId;
    }

    public void setUserCreateUserId(String userCreateUserId) {
        this.userCreateUserId = userCreateUserId == null ? null : userCreateUserId.trim();
    }

    public String getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(String userStatus) {
        this.userStatus = userStatus == null ? null : userStatus.trim();
    }

    public Integer getUserOrderNum() {
        return userOrderNum;
    }

    public void setUserOrderNum(Integer userOrderNum) {
        this.userOrderNum = userOrderNum;
    }
}