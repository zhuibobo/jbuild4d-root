package com.jbuild4d.web.platform.controller.selectview;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/28
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/SelectView/SelectValidateRule")
public class SelectValidateRuleController {
    @RequestMapping(value = "/Select", method = RequestMethod.GET)
    public ModelAndView select() {
        ModelAndView modelAndView=new ModelAndView("SelectView/SelectValidateRule");
        return modelAndView;
    }
}
