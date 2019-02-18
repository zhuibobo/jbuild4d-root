package com.jbuild4d.web.platform.controller.system.dictionary;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/19
 * To change this template use File | Settings | File Templates.
 */

@Controller
@RequestMapping(value = "/PlatForm/System/Dictionary")
public class DictionaryManagerController {

    @RequestMapping(value = "/DictionaryManagerView", method = RequestMethod.GET)
    public ModelAndView dictionaryManagerView() {
        ModelAndView modelAndView=new ModelAndView("System/Dictionary/DictionaryManager");
        return modelAndView;
    }
}
