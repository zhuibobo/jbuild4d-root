package com.jbuild4d.web.platform.controller.system.codegenerate;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/25
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/System/CodeGenerate")
public class CodeGenerateController {

    @RequestMapping(value = "Manager", method = RequestMethod.GET)
    public ModelAndView manger() {
        ModelAndView modelAndView=new ModelAndView("System/DBResolver/Manager");
        return modelAndView;
    }
}
