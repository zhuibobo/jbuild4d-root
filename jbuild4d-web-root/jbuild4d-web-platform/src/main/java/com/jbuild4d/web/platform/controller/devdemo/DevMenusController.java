package com.jbuild4d.web.platform.controller.devdemo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/15
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/DevDemo")
public class DevMenusController {

    @RequestMapping(value = "/MenusView", method = RequestMethod.GET)
    public ModelAndView menus() {
        ModelAndView modelAndView=new ModelAndView("DevDemo/DevLeftMenus");
        return modelAndView;
    }
}
