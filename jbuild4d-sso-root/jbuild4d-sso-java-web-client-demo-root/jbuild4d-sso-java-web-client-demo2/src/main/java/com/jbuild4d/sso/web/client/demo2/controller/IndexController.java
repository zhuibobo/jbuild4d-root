package com.jbuild4d.sso.web.client.demo2.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/Index")
public class IndexController {

    @RequestMapping(value = "/Welcome", method = RequestMethod.GET)
    public ModelAndView welcome() {
        ModelAndView mv=new ModelAndView();
        mv.setViewName("Welcome");
        return mv;
    }

    @RequestMapping(value = "/Desktop", method = RequestMethod.GET)
    public ModelAndView Desktop() {
        ModelAndView mv=new ModelAndView();
        mv.setViewName("Desktop");
        return mv;
    }

}
