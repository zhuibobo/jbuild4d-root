package com.jbuild4d.platform.system.devdemo;

import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTreeTableEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/23
 * To change this template use File | Settings | File Templates.
 */
public interface IDevDemoTreeTableService  extends IBaseService<DevDemoTreeTableEntity> {
    DevDemoTreeTableEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException;
}
