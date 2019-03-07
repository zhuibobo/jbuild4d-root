package com.jbuild4d.web.platform.rest.sso.role;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.sso.service.IUserRoleService;
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

    @RequestMapping(value = "BindUsersWithRole", method = RequestMethod.POST)
    public JBuild4DResponseVo bindUsersWithRole(String roleId,@RequestParam("userIds[]") List<String> userIds) throws JBuild4DGenerallyException {
        //List<RoleGroupEntity> datasetGroupEntityList=roleGroupService.getALLOrderByAsc(JB4DSessionUtility.getSession());
        userRoleService.bindUsersWithRole(JB4DSessionUtility.getSession(),roleId,userIds);
        return JBuild4DResponseVo.opSuccess();
    }
}
