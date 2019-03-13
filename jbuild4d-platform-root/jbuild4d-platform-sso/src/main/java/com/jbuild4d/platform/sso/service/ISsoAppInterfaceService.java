package com.jbuild4d.platform.sso.service;

import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppInterfaceEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

import java.util.List;

public interface ISsoAppInterfaceService extends IBaseService<SsoAppInterfaceEntity> {
    List<SsoAppInterfaceEntity> getAppInterfaces(JB4DSession jb4DSession, String appId);
}
