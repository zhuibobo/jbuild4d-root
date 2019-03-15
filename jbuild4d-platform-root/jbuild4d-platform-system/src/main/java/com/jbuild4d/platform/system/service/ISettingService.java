package com.jbuild4d.platform.system.service;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.SettingEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSession;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public interface ISettingService extends IBaseService<SettingEntity> {
    public static final String SETTINGUSERDEFAULTPASSWORD = "SettingUserDefaultPassword";

    void initSystemData(JB4DSession jb4DSession) throws JBuild4DGenerallyException;

    SettingEntity getByKey(JB4DSession jb4DSession, String key);
}
