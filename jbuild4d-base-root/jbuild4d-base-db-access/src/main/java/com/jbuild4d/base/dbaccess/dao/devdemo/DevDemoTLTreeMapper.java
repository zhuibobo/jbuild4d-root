package com.jbuild4d.base.dbaccess.dao.devdemo;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTLTreeEntity;
import org.apache.ibatis.annotations.Param;

public interface DevDemoTLTreeMapper extends BaseMapper<DevDemoTLTreeEntity> {

    DevDemoTLTreeEntity selectLessThanRecord(@Param("id") String id,@Param("parentId") String ddttParentId);

    DevDemoTLTreeEntity selectGreaterThanRecord(@Param("id") String id,@Param("parentId") String ddttParentId);
}