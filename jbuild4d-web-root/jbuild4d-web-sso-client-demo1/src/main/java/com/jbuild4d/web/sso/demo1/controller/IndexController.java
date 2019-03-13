package com.jbuild4d.web.sso.demo1.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/Index")
public class IndexController {

    @RequestMapping(value = "/Welcome", method = RequestMethod.GET)
    @ResponseBody
    public String welcome() {
       return "Index-Welcome";
    }
}
