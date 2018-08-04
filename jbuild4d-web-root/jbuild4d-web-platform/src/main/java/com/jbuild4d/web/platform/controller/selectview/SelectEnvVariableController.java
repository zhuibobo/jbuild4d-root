package com.jbuild4d.web.platform.controller.selectview;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/4
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/SelectView/SelectEnvVariable")
public class SelectEnvVariableController {

    @RequestMapping(value = "Select", method = RequestMethod.GET)
    public ModelAndView select() {
        ModelAndView modelAndView=new ModelAndView("SelectView/SelectEnvVariable");
        return modelAndView;
    }
}
