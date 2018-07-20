package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.DictionaryEntity;

import java.util.List;

public interface DictionaryMapper extends BaseMapper<DictionaryEntity> {
    List<DictionaryEntity> selectByGroupId(String groupId);
}