package com.jbuild4d.base.dbaccess.dao.systemsetting;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.SettingEntity;

public interface SettingMapper extends BaseMapper<SettingEntity> {
    SettingEntity selectByKeyField(String key);
}