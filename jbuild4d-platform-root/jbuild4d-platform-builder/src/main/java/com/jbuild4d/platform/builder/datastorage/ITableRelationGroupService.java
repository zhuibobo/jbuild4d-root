package com.jbuild4d.platform.builder.datastorage;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;

public interface ITableRelationGroupService extends IBaseService<TableRelationGroupEntity> {
    String getRootId();

    TableRelationGroupEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException;

    TableRelationGroupEntity createSystemTableRelationGroupNode(JB4DSession jb4DSession, TableRelationGroupEntity parentGroup) throws JBuild4DGenerallyException;
}