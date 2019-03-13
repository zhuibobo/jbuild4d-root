package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppInterfaceEntity;

import java.util.List;

public interface SsoAppInterfaceMapper extends BaseMapper<SsoAppInterfaceEntity> {
    List<SsoAppInterfaceEntity> selectAppInterfaces(String appId);
}
