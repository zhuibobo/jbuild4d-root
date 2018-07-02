package com.jbuild4d.web.platform.controller.base;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.platform.system.service.impl.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/PlatForm/Base")
public class FrameController {

    @Autowired
    JsonUtility jsonUtility;

    @Autowired
    IMenuService menuService;

    @RequestMapping(value = "Frame", method = RequestMethod.GET)
    public ModelAndView frame() throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView("Frame");
        modelAndView.addObject("menuJson",jsonUtility.toObjectString(menuService.getALL()));
        JB4DSession session= JB4DSessionUtility.getSession();
        modelAndView.addObject("currUserEntity", jsonUtility.toObjectString(session));
        return modelAndView;
    }
}
