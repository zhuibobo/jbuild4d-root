package com.jbuild4d.base.dbaccess.dao.devdemo;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTLTreeListEntity;
import org.apache.ibatis.annotations.Param;

public interface DevDemoTLTreeListMapper extends BaseMapper<DevDemoTLTreeListEntity> {
    DevDemoTLTreeListEntity selectGreaterThanRecord(@Param("id") String id,@Param("groupId") String ddtlGroupId);

    DevDemoTLTreeListEntity selectLessThanRecord(@Param("id") String id,@Param("groupId") String ddtlGroupId);
}