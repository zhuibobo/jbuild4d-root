package com.jbuild4d.base.dbaccess.dao.sso;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.RoleGroupEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface RoleGroupMapper extends BaseMapper<RoleGroupEntity> {
    List<RoleGroupEntity> selectAllOrderByAsc();

    int countChildsRoleGroup(String groupId);

    RoleGroupEntity selectLessThanRecord(@Param("id") String id, @Param("parentId") String roleGroupParentId);

    RoleGroupEntity selectGreaterThanRecord(@Param("id")String id,@Param("parentId") String roleGroupParentId);
}
