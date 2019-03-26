package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface TableRelationMapper extends BaseMapper<TableRelationEntity> {
    List<TableRelationEntity> selectByGroupId(String groupId);

    TableRelationEntity selectLessThanRecord(@Param("id") String id,@Param("groupId") String relationGroupId);

    TableRelationEntity selectGreaterThanRecord(@Param("id") String id,@Param("groupId") String relationGroupId);
}
