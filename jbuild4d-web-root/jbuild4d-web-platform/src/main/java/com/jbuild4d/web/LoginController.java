package com.jbuild4d.web;

import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
public class LoginController {

    @RequestMapping(value = "/Login", method = RequestMethod.GET)
    public ModelAndView login(HttpServletRequest request) {
        System.out.println("Home Controller Call");
        ModelAndView modelAndView=new ModelAndView("Login");

        request.getSession().setAttribute("theme",request.getContextPath()+"/Themes/Default");
        return modelAndView;
    }

}
