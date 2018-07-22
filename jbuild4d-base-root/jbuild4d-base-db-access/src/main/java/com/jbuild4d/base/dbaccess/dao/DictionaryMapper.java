package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.DictionaryEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface DictionaryMapper extends BaseMapper<DictionaryEntity> {
    List<DictionaryEntity> selectByGroupId(String groupId);

    List<DictionaryEntity> selectByParentId(String parentId);

    DictionaryEntity selectLessThanRecord(@Param("dictId") String id,@Param("dictParentId") String dictParentId);

    DictionaryEntity selectGreaterThanRecord(@Param("dictId") String id,@Param("dictParentId") String dictParentId);

    List<DictionaryEntity> selectByGroupValue(String groupValue);
}