package com.jbuild4d.base.tools;

import org.ehcache.CacheManager;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public class BeanUtility {
    private static WebApplicationContext context;

    public static WebApplicationContext getContext() {
        return context;
    }

    public static void setContext(WebApplicationContext _context) {
        context = _context;
    }

    public static <T> T getBean(String name){
        return  ((T) context.getBean(name));
    }

    public static <T> T getBean(Class<T> classT){
        return context.getBean(classT);
    }
}
