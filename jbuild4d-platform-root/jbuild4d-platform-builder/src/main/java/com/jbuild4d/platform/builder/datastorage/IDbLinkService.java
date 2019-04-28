package com.jbuild4d.platform.builder.datastorage;

import com.jbuild4d.base.dbaccess.dbentities.builder.DbLinkEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;

public interface IDbLinkService extends IBaseService<DbLinkEntity> {
    String getLocationDBLinkId();

    DbLinkEntity getDBLinkEntity(JB4DSession jb4DSession) throws JBuild4DGenerallyException;

    void createLocationDBLink(JB4DSession jb4DSession) throws JBuild4DGenerallyException;
}
