package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.SsoAppEntity;

import java.util.List;

public interface SsoAppMapper extends BaseMapper<SsoAppEntity> {
    List<SsoAppEntity> selectALLSubApp(String appId);

    List<SsoAppEntity> selectAllMainApp();
}
