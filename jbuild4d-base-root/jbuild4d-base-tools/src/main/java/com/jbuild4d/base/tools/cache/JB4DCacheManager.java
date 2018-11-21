package com.jbuild4d.base.tools.cache;

import org.ehcache.CacheManager;
import org.ehcache.config.Configuration;
import org.springframework.web.context.ContextLoader;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public class JB4DCacheManager {

    private static CacheManager cacheManager = ((CacheManager) ContextLoader.getCurrentWebApplicationContext().getBean("cacheManager"));

    public void put(String key,Object obj){
        //cacheManager.get
    }

    /*public static <T> T get(String key){

    }*/
}
