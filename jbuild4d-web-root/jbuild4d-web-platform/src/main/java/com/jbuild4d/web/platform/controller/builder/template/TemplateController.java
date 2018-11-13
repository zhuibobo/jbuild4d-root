package com.jbuild4d.web.platform.controller.builder.template;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/Template")
public class TemplateController {

    @RequestMapping(value = "ListView", method = RequestMethod.GET)
    public ModelAndView listView() throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView("Builder/Template");
        return modelAndView;
    }
}
