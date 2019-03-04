package com.jbuild4d.platform.sso.vo;

import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentUserEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.UserEntity;

public class DepartmentUserVo {
    private DepartmentUserEntity departmentUserEntity;
    private UserEntity userEntity;
    private String tempAccountPassword;

    public DepartmentUserEntity getDepartmentUserEntity() {
        return departmentUserEntity;
    }

    public void setDepartmentUserEntity(DepartmentUserEntity departmentUserEntity) {
        this.departmentUserEntity = departmentUserEntity;
    }

    public UserEntity getUserEntity() {
        return userEntity;
    }

    public void setUserEntity(UserEntity userEntity) {
        this.userEntity = userEntity;
    }

    public String getTempAccountPassword() {
        return tempAccountPassword;
    }

    public void setTempAccountPassword(String tempAccountPassword) {
        this.tempAccountPassword = tempAccountPassword;
    }
}
