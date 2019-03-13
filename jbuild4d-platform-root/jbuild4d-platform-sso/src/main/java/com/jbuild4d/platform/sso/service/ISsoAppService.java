package com.jbuild4d.platform.sso.service;

import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.sso.vo.SSOAppVo;

public interface ISsoAppService extends IBaseService<SsoAppEntity> {
    void saveIntegratedMainApp(JB4DSession jb4DSession, SSOAppVo entity) throws JBuild4DGenerallyException;

    SSOAppVo getAppVo(JB4DSession jb4DSession, String appId);
}
