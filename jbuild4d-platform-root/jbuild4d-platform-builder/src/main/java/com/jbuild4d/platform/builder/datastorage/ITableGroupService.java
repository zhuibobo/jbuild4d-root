package com.jbuild4d.platform.builder.datastorage;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface ITableGroupService  extends IBaseService<TableGroupEntity> {
    String getRootId();

    TableGroupEntity createRootNode(JB4DSession jb4DSession,String dbLinkId,String text,String value) throws JBuild4DGenerallyException;

    TableGroupEntity createSystemTableGroupNode(JB4DSession jb4DSession, TableGroupEntity parentGroup) throws JBuild4DGenerallyException;

    TableGroupEntity getByGroupText(JB4DSession jb4DSession,String groupText);

    TableGroupEntity getLocationTableGroupRoot(JB4DSession jb4DSession);

    List<TableGroupEntity> getByDBLinkId(JB4DSession session, String dbLinkId);
}
