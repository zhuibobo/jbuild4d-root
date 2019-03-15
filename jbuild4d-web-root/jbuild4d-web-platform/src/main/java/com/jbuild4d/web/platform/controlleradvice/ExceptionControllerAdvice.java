package com.jbuild4d.web.platform.controlleradvice;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.exception.SessionTimeoutException;
import com.jbuild4d.base.tools.JsonUtility;
import com.jbuild4d.web.platform.controller.LoginController;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import org.apache.ibatis.binding.BindingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
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

    Logger logger = LoggerFactory.getLogger(LoginController.class);

    @ExceptionHandler(IOException.class)
    public void processIOException(HttpServletResponse response,HttpServletRequest request, IOException e) {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        handlerGenerallyException(response, request, e);
    }

    @ExceptionHandler(JBuild4DGenerallyException.class)
    public void processGenerallyException(HttpServletResponse response,HttpServletRequest request, JBuild4DGenerallyException e) {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json;charset=UTF-8");
        handlerGenerallyException(response, request, e);
    }

    private void handlerGenerallyException(HttpServletResponse response, HttpServletRequest request, Exception e) {
        try {
            String msg=e.getMessage();
            String traceMsg=org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace(e);
            response.getWriter().print(JsonUtility.toObjectString(JBuild4DResponseVo.error(msg,traceMsg)));
        } catch (IOException e1) {
            logger.error(request.getRequestURI()+":"+e1.getMessage(),e1);
            e1.printStackTrace();
        }
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
