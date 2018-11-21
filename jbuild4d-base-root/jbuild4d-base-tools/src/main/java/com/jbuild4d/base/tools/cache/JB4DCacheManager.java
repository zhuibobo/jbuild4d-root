package com.jbuild4d.base.tools.cache;

import com.jbuild4d.base.tools.common.BeanUtility;
import org.ehcache.CacheManager;
import org.springframework.web.context.ContextLoader;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public class JB4DCacheManager {

    private static CacheManager cacheManager = BeanUtility.getBean(CacheManager.class);

    public static void put(String cacheName,String key,String value){
        cacheManager.getCache(cacheName,String.class,String.class).put(key,value);
    }

    public static <T> T get(String cacheName,String key){
        return (T) cacheManager.getCache(cacheName,String.class,String.class).get(key);
    }
    /*public static <T> T get(String key){

    }*/
}
