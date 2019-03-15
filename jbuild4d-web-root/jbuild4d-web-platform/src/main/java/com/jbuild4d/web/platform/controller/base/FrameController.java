package com.jbuild4d.web.platform.controller.base;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.dbaccess.dbentities.builder.MenuEntity;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.JsonUtility;
import com.jbuild4d.platform.system.service.IMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping(value = "/PlatForm/Base")
public class FrameController {

    @Autowired
    IMenuService menuService;

    @RequestMapping(value = "FrameView", method = RequestMethod.GET)
    public ModelAndView frameView() throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView("FrameV1/FrameView");
        JB4DSession jb4DSession=JB4DSessionUtility.getSession();
        modelAndView.addObject("menuJson",JsonUtility.toObjectString(menuService.getALL(jb4DSession)));
        JB4DSessionUtility.setUserInfoToMV(modelAndView);

        //todo
        List<MenuEntity> myMenus=menuService.getALL(jb4DSession);
        //String myMenusJsonString=JsonUtility.toObjectString(myMenus);
        modelAndView.addObject("myMenusJson",myMenus);
        return modelAndView;
    }

    @RequestMapping(value = "LeftMenuView", method = RequestMethod.GET)
    public ModelAndView leftMenu() throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView("LeftMenuView");
        return modelAndView;
    }

    @RequestMapping(value = "RightContentView", method = RequestMethod.GET)
    public ModelAndView rightContent() throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView("RightContentView");
        return modelAndView;
    }
}
