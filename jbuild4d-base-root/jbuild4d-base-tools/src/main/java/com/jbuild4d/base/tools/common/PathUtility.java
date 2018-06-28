package com.jbuild4d.base.tools.common;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.net.MalformedURLException;
import java.net.URL;

public class PathUtility {

    private WebApplicationContext context;

    public WebApplicationContext getContext() {
        return context;
    }

    public void setContext(WebApplicationContext context) {
        this.context = context;
    }

    public ServletContext getServletContext(){
        return context.getServletContext();
    }

    public String getServletContextRealPath(){
        return getServletContext().getRealPath("");
    }

    public String getServletContextRealPath(String path){
        return getServletContext().getRealPath(path);
    }

    public String getAbsoluteUrl(String path){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return  "http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+path;
    }

    public String getWebInfPath(){
        //return Thread.currentThread().getContextClassLoader().getResource("").getPath();
        return getServletContextRealPath("WEB-INF");
    }

    public URL getResource(String path) throws MalformedURLException {
        return getServletContext().getResource(path);
    }
}
