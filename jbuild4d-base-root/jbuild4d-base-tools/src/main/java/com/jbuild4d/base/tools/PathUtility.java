package com.jbuild4d.base.tools;

import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.net.MalformedURLException;
import java.net.URL;

public class PathUtility {

    private static WebApplicationContext context;

    public static WebApplicationContext getContext() {
        return context;
    }

    public static void setContext(WebApplicationContext _context) {
        context = _context;
    }

    public static ServletContext getServletContext(){
        return context.getServletContext();
    }

    public static String getServletContextRealPath(){
        return getServletContext().getRealPath("");
    }

    public static String getServletContextRealPath(String path){
        return getServletContext().getRealPath(path);
    }

    public static String getAbsoluteUrl(String path){
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return  "http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+path;
    }

    public static String getWebInfPath(){
        //return Thread.currentThread().getContextClassLoader().getResource("").getPath();
        return getServletContextRealPath("WEB-INF");
    }

    public static URL getResource(String path) throws MalformedURLException {
        return getServletContext().getResource(path);
    }
}
