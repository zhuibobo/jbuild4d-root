package com.jbuild4d.web;

import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;

@Controller
public class LoginController {

    @RequestMapping(value = "/Login", method = RequestMethod.GET)
    public ModelAndView login(HttpServletRequest request) {
        System.out.println("Home Controller Call");
        ModelAndView modelAndView=new ModelAndView("Login");

        request.getSession().setAttribute("theme",request.getContextPath()+"/Themes/Default");
        return modelAndView;
    }

    @RequestMapping(value = "/ValidateAccount", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo validateAccount(String account, String password,HttpServletRequest request) throws IOException, ParseException {
        JB4DSession b4DSession = new JB4DSession();
        b4DSession.setOrganName("4D");
        b4DSession.setUserName("Alex");
        JB4DSessionUtility.addSessionAttr(JB4DSessionUtility.UserLoginSessionKey, b4DSession);
        request.getSession().setAttribute("theme",request.getContextPath()+"/Themes/Default");
        return JBuild4DResponseVo.opSuccess();
    }
}
