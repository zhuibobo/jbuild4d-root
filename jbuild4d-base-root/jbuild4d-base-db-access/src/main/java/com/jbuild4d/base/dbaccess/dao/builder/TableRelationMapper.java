package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntityWithBLOBs;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface TableRelationMapper extends BaseMapper<TableRelationEntityWithBLOBs> {
    List<TableRelationEntityWithBLOBs> selectByGroupId(String groupId);

    TableRelationEntityWithBLOBs selectLessThanRecord(@Param("id") String id,@Param("groupId") String relationGroupId);

    TableRelationEntityWithBLOBs selectGreaterThanRecord(@Param("id") String id,@Param("groupId") String relationGroupId);
}
