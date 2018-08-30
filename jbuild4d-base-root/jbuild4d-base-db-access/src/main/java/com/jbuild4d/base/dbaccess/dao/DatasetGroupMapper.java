package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public interface DatasetGroupMapper extends BaseMapper<DatasetGroupEntity> {

    DatasetGroupEntity selectLessThanRecord(@Param("id") String id, @Param("parentId") String parentId);

    DatasetGroupEntity selectGreaterThanRecord(@Param("id")String id,@Param("parentId") String parentId);

}
