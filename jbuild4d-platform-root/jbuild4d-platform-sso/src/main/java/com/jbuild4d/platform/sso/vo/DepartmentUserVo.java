package com.jbuild4d.platform.sso.vo;

import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentUserEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.UserEntity;

public class DepartmentUserVo {
    private DepartmentUserEntity departmentUserEntity;
    private UserEntity userEntity;
    private OrganEntity organEntity;
    private DepartmentEntity departmentEntity;

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

    public OrganEntity getOrganEntity() {
        return organEntity;
    }

    public void setOrganEntity(OrganEntity organEntity) {
        this.organEntity = organEntity;
    }

    public DepartmentEntity getDepartmentEntity() {
        return departmentEntity;
    }

    public void setDepartmentEntity(DepartmentEntity departmentEntity) {
        this.departmentEntity = departmentEntity;
    }
}
