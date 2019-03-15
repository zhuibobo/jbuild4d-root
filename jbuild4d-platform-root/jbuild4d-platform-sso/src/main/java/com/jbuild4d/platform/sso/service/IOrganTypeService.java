package com.jbuild4d.platform.sso.service;

import com.jbuild4d.base.dbaccess.dbentities.sso.OrganTypeEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
public interface IOrganTypeService extends IBaseService<OrganTypeEntity> {
    void createDefaultOrganType(JB4DSession jb4DSession) throws JBuild4DGenerallyException;
}