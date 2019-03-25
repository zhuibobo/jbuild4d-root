package com.jbuild4d.web.platform.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.platform.system.service.IOperationLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(value = "/PlatForm")
public class LoginController {

    Logger logger = LoggerFactory.getLogger(LoginController.class);

    @Autowired
    IMenuService menuService;

    @Autowired
    IOperationLogService operationLogService;

    @RequestMapping(value = "/LoginSSOView", method = RequestMethod.GET)
    public ModelAndView loginSSOView(HttpServletRequest request) {

        ModelAndView modelAndView=new ModelAndView("Login");

        request.getSession().setAttribute("theme",request.getContextPath()+"/Themes/Default");
        return modelAndView;
    }

    @RequestMapping(value = "/LoginView", method = RequestMethod.GET)
    public ModelAndView loginView(HttpServletRequest request) {

        System.out.println("Home Controller Call");
        ModelAndView modelAndView=new ModelAndView("Login");

        request.getSession().setAttribute("theme",request.getContextPath()+"/Themes/Default");
        return modelAndView;
    }

    @RequestMapping(value = "/LoginOutView", method = RequestMethod.GET)
    public ModelAndView loginOut(HttpServletRequest request) throws JsonProcessingException, JBuild4DGenerallyException {
        ModelAndView modelAndView=new ModelAndView("Login");
        operationLogService.writeUserExitLog(JB4DSessionUtility.getSession(),this.getClass(),request);
        JB4DSessionUtility.clearMySession();
        return modelAndView;
    }

    @RequestMapping(value = "/RedirectLoginView", method = RequestMethod.GET)
    public ModelAndView RedirectLogin(HttpServletRequest request) {

        ModelAndView modelAndView=new ModelAndView("SessionTimeout");
        request.getSession().setAttribute("theme",request.getContextPath()+"/Themes/Default");
        return modelAndView;
    }
}
