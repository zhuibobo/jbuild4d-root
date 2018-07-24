package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoTLTreeEntity;
import org.apache.ibatis.annotations.Param;

public interface DevDemoTLTreeMapper extends BaseMapper<DevDemoTLTreeEntity> {

    DevDemoTLTreeEntity selectLessThanRecord(@Param("id") String id,@Param("parentId") String ddttParentId);

    DevDemoTLTreeEntity selectGreaterThanRecord(@Param("id") String id,@Param("parentId") String ddttParentId);
}