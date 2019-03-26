package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntity;

import java.util.List;

public interface TableRelationMapper extends BaseMapper<TableRelationEntity> {
    List<TableRelationEntity> selectByGroupId(String groupId);
}
