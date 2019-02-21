package com.jbuild4d.web.platform.rest.system.menu;

import com.jbuild4d.base.dbaccess.dbentities.builder.MenuEntity;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/System/Menu")
public class MenuRestResource {

    @Autowired
    IMenuService menuService;

    @RequestMapping(value = "/GetMyMenu", method = RequestMethod.POST)
    public JBuild4DResponseVo getMyMenu() {
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        List<MenuEntity> myMenus=menuService.getALL(jb4DSession);
        return JBuild4DResponseVo.success("",myMenus);
    }

}
