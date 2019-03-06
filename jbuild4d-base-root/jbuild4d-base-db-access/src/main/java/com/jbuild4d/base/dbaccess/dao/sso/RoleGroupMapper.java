package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.RoleGroupEntity;

import java.util.List;

public interface RoleGroupMapper extends BaseMapper<RoleGroupEntity> {
    List<RoleGroupEntity> selectAllOrderByAsc();
}
