package com.jbuild4d.web.platform.rest.sso.role;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.sso.UserEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.sso.service.IUserRoleService;
import com.jbuild4d.platform.sso.service.IUserService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/UserRoleBind")
public class UserRoleBindRestResource {

    @Autowired
    IUserRoleService userRoleService;

    @Autowired
    IUserService userService;

    @RequestMapping(value = "BindUsersWithRole", method = RequestMethod.POST)
    public JBuild4DResponseVo bindUsersWithRole(String roleId,@RequestParam("userIds[]") List<String> userIds) throws JBuild4DGenerallyException {
        userRoleService.bindUsersWithRole(JB4DSessionUtility.getSession(),roleId,userIds);
        return JBuild4DResponseVo.opSuccess();
    }

    @RequestMapping(value = "GetBindRoleUsers", method = RequestMethod.POST)
    public JBuild4DResponseVo getBindRoleUsers(String roleId,Integer pageSize,Integer pageNum) throws JBuild4DGenerallyException {
        PageInfo<UserEntity> pageInfo = userService.getBindRoleUsers(roleId,pageNum,pageSize);
        return JBuild4DResponseVo.getDataSuccess(pageInfo);
    }

    @RequestMapping(value = "DeleteUserRoleBind", method = RequestMethod.DELETE)
    public JBuild4DResponseVo deleteUserRoleBind(String roleId,String userId) throws JBuild4DGenerallyException {
        userRoleService.deleteUserRoleBind(roleId,userId);
        return JBuild4DResponseVo.opSuccess();
    }

    @RequestMapping(value = "ClearAllRoleMember", method = RequestMethod.DELETE)
    public JBuild4DResponseVo clearAllRoleMember(String roleId) throws JBuild4DGenerallyException {
        userRoleService.clearAllRoleMember(roleId);
        return JBuild4DResponseVo.opSuccess();
    }
}
