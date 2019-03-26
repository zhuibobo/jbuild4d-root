package com.jbuild4d.base.dbaccess.dao.builder;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationGroupEntity;

import java.util.List;

public interface TableRelationGroupMapper extends BaseMapper<TableRelationGroupEntity> {
    List<TableRelationGroupEntity> selectChilds(String id);
}
