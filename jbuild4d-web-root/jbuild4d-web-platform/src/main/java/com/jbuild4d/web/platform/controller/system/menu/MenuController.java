package com.jbuild4d.web.platform.controller.system.menu;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.MenuEntity;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/23
 * To change this template use File | Settings | File Templates.
 */

@Controller
@RequestMapping(value = "/PlatForm/Menu")
public class MenuController {
    @Autowired
    IMenuService menuService;

    @RequestMapping(value = "GetMyMenu", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getMyMenu() {
        JB4DSession jb4DSession=JB4DSessionUtility.getSession();
        List<MenuEntity> myMenus=menuService.getALL(jb4DSession);
        return JBuild4DResponseVo.success("",myMenus);
    }
}
