package com.jbuild4d.platform.system.service;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.Jb4dCacheEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.session.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public interface IJb4dCacheService extends IBaseService<Jb4dCacheEntity> {

    boolean sysRunStatusIsDebug() throws JBuild4DGenerallyException;

    Jb4dCacheEntity getSysRunStatus() throws JBuild4DGenerallyException;

    void initSystemData(JB4DSession jb4DSession) throws JBuild4DGenerallyException;
}
