package com.jbuild4d.web.platform.interceptor;

import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.core.base.exception.SessionTimeoutException;
import com.jbuild4d.core.base.session.JB4DSession;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

public class SSOLoginedInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //如果是来自SSO客户端的请求,判断是否登录过,是的话直接返回SSO_CODE;

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }

}
