package com.jbuild4d.web.platform.interceptor;

import com.jbuild4d.core.base.exception.SessionTimeoutException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
public class LoginedInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        response.setContentType("text/html;charset=UTF-8");
        Map<String,String> igUrl=new HashMap<>();
        igUrl.put("/PlatForm/LoginView.do","");
        igUrl.put("/PlatForm/RedirectLoginView.do","");
        igUrl.put("/PlatFormRest/ValidateAccount.do","");
        igUrl.put("/PlatForm/LoginOutView.do","");
        String absPath=request.getRequestURI();
        String appName=request.getContextPath();
        String url=absPath.replaceAll(appName,"");
        if(igUrl.containsKey(url)){
            return true;
        }
        if(url.indexOf(".do")>=0){
            try {
                JB4DSession session = JB4DSessionUtility.getSession();
                if (session == null) {
                    response.sendRedirect(appName+"/PlatForm/RedirectLoginView.do");
                    return false;
                }
            }
            catch (SessionTimeoutException ex){
                response.sendRedirect(appName+"/PlatForm/RedirectLoginView.do");
                return false;
            }
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}
