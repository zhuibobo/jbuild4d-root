package com.jbuild4d.base.dbaccess.dao.devdemo;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTreeTableEntity;
import org.apache.ibatis.annotations.Param;

public interface DevDemoTreeTableMapper extends BaseMapper<DevDemoTreeTableEntity> {
    DevDemoTreeTableEntity selectLessThanRecord(@Param("id") String id, @Param("parentId") String ddttParentId);

    DevDemoTreeTableEntity selectGreaterThanRecord(@Param("id") String id, @Param("parentId") String ddttParentId);
}