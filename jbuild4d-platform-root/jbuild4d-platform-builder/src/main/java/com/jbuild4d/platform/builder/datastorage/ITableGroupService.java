package com.jbuild4d.platform.builder.datastorage;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface ITableGroupService  extends IBaseService<TableGroupEntity> {
    String getRootId();

    TableGroupEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException;

    TableGroupEntity createSystemTableGroupNode(JB4DSession jb4DSession, TableGroupEntity parentGroup) throws JBuild4DGenerallyException;

    TableGroupEntity getByGroupText(JB4DSession jb4DSession,String groupText);
}
