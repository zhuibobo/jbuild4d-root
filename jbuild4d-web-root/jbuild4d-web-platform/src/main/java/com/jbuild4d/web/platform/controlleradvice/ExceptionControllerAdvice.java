package com.jbuild4d.web.platform.controlleradvice;

import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.exception.SessionTimeoutException;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.apache.ibatis.binding.BindingException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/20
 * To change this template use File | Settings | File Templates.
 */

@ControllerAdvice
public class ExceptionControllerAdvice {

    @ExceptionHandler(JBuild4DGenerallyException.class)
    public void processGenerallyException(HttpServletResponse response,NativeWebRequest request, JBuild4DGenerallyException e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        try {
            response.getWriter().print(JsonUtility.toObjectString(JBuild4DResponseVo.error(e.getMessage())));
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        //return JBuild4DResponseVo.error(e.getMessage());
        //return "UnauthenticatedExceptionView"; //返回一个逻辑视图名
    }

    @ExceptionHandler(SessionTimeoutException.class)
    public ModelAndView processSessionTimeoutException(HttpServletResponse response, HttpServletRequest request, SessionTimeoutException e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        try {
            request.getSession().setAttribute("theme",request.getContextPath()+"/Themes/Default");
            response.getWriter().print(JsonUtility.toObjectString(JBuild4DResponseVo.error(e.getMessage())));
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        ModelAndView mv=new ModelAndView("SessionTimeout");
        return mv;
    }

    @ExceptionHandler(BindingException.class)
    public void processMyBatisBindingException(HttpServletResponse response, HttpServletRequest request, BindingException e) {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        try {
            response.getWriter().print(JsonUtility.toObjectString(JBuild4DResponseVo.error(e.getMessage())));
        } catch (IOException e1) {
            e1.printStackTrace();
        }
    }
}
