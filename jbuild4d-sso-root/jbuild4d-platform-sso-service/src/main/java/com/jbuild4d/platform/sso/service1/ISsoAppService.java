package com.jbuild4d.platform.sso.service1;

import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.sso.service1.vo.SSOAppVo;

import java.util.List;

public interface ISsoAppService extends IBaseService<SsoAppEntity> {
    void saveIntegratedMainApp(JB4DSession jb4DSession, SSOAppVo entity) throws JBuild4DGenerallyException;

    SSOAppVo getAppVo(JB4DSession jb4DSession, String appId);

    void saveIntegratedSubApp(JB4DSession jb4DSession, SSOAppVo entity) throws JBuild4DGenerallyException;

    List<SsoAppEntity> getALLSubApp(JB4DSession session, String appId);

    List<SsoAppEntity> getALLMainApp(JB4DSession session);
}
