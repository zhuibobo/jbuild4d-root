package com.jbuild4d.platform.system.service;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.DictionaryGroupEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public interface IDictionaryGroupService extends IBaseService<DictionaryGroupEntity> {

    void initSystemData(JB4DSession jb4DSession, IDictionaryService dictionaryService) throws JBuild4DGenerallyException;
}
