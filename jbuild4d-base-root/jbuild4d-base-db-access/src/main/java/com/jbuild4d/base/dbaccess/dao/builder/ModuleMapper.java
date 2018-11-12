package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.ModuleEntity;
import org.apache.ibatis.annotations.Param;

public interface ModuleMapper extends BaseMapper<ModuleEntity> {
    ModuleEntity selectLessThanRecord(@Param("id") String id,@Param("parentId") String moduleParentId);

    ModuleEntity selectGreaterThanRecord(@Param("id")String id,@Param("parentId") String moduleParentId);
}