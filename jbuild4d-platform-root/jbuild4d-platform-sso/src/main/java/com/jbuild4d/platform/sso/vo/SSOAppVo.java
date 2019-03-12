package com.jbuild4d.platform.sso.vo;

import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppInterfaceEntity;

import java.util.List;

public class SSOAppVo {
    private SsoAppEntity ssoAppEntity;
    private List<SsoAppInterfaceEntity> ssoAppInterfaceEntityList;

    public SsoAppEntity getSsoAppEntity() {
        return ssoAppEntity;
    }

    public void setSsoAppEntity(SsoAppEntity ssoAppEntity) {
        this.ssoAppEntity = ssoAppEntity;
    }

    public List<SsoAppInterfaceEntity> getSsoAppInterfaceEntityList() {
        return ssoAppInterfaceEntityList;
    }

    public void setSsoAppInterfaceEntityList(List<SsoAppInterfaceEntity> ssoAppInterfaceEntityList) {
        this.ssoAppInterfaceEntityList = ssoAppInterfaceEntityList;
    }
}
