package com.jbuild4d.platform.builder.dataset;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.session.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public interface IDatasetGroupService extends IBaseService<DatasetGroupEntity> {
    DatasetGroupEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException;

    String getRootId();
}
