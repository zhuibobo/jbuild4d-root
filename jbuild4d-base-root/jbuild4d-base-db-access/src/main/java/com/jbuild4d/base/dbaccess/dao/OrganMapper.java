package com.jbuild4d.base.dbaccess.dao;

import com.jbuild4d.base.dbaccess.dbentities.organrelevance.OrganEntity;
import org.apache.ibatis.annotations.Param;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
public interface OrganMapper extends BaseMapper<OrganEntity> {
    OrganEntity selectLessThanRecord(@Param("id") String id,@Param("parentId") String organParentId);

    OrganEntity selectGreaterThanRecord(@Param("id") String id,@Param("parentId") String organParentId);
}
