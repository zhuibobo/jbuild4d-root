package com.jbuild4d.platform.sso.service1;

import com.jbuild4d.base.dbaccess.dbentities.sso.UserRoleEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.core.base.session.JB4DSession;

import java.util.List;

public interface IUserRoleService extends IBaseService<UserRoleEntity> {
    void bindUsersWithRole(JB4DSession jb4DSession, String roleId, List<String> userIds) throws JBuild4DGenerallyException;

    boolean bindExist(JB4DSession jb4DSession, String roleId, String userId);

    void deleteUserRoleBind(String roleId,String userId);

    void clearAllRoleMember(String roleId);
}
