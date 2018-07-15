package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.SettingMapper;
import com.jbuild4d.base.dbaccess.dbentities.SettingEntity;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.ISettingService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class SettingServiceImpl extends BaseServiceImpl<SettingEntity> implements ISettingService {

    SettingMapper settingMapper;

    public SettingServiceImpl(SettingMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        settingMapper = _defaultBaseMapper;
    }
}
