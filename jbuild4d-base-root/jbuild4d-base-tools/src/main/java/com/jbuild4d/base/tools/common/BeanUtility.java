package com.jbuild4d.base.tools.common;

import org.ehcache.CacheManager;
import org.springframework.web.context.ContextLoader;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public class BeanUtility {
    public static <T> T getBean(String name){
        return  ((T) ContextLoader.getCurrentWebApplicationContext().getBean(name));
    }
}
