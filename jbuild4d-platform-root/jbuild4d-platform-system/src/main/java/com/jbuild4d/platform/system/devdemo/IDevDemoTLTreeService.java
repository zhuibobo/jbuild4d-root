package com.jbuild4d.platform.system.devdemo;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoTLTreeEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
public interface IDevDemoTLTreeService extends IBaseService<DevDemoTLTreeEntity> {
    DevDemoTLTreeEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException;
}
