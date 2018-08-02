package com.jbuild4d.platform.builder.service;

import com.jbuild4d.base.dbaccess.dbentities.TableGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public interface ITableGroupService  extends IBaseService<TableGroupEntity> {
    TableGroupEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException;
}
