package com.jbuild4d.base.tools.cache;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
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

    public static String jb4dPlatformBuilderCacheName="jb4dPlatformBuilder";
    public static String jb4dPlatformSSOCacheName="jb4dPlatformSSO";

    private static CacheManager cacheManager = BeanUtility.getBean(CacheManager.class);

    public static void put(String cacheName,String key,String value){
        cacheManager.getCache(cacheName,String.class,String.class).put(key,value);
    }

    public static void put(String cacheName,String key,Object value){
        cacheManager.getCache(cacheName,String.class,Object.class).put(key,value);
    }

    public static <T> T getString(String cacheName,String key){
        return (T) cacheManager.getCache(cacheName,String.class,String.class).get(key);
    }

    public static <T> T getObject(String cacheName,String key){
        return (T) cacheManager.getCache(cacheName,String.class,Object.class).get(key);
    }

    public static boolean exist(String cacheName, String key) {
        return cacheManager.getCache(cacheName, String.class, Object.class).get(key) != null ? true : false;
    }

    public static <T> T autoGetFromCache(String cacheName,boolean cancelCache,String key,IBuildGeneralObj<T> builder) throws JBuild4DGenerallyException {
        T result=null;
        if(cancelCache){
            result=builder.BuildObj();
            return result;
        }
        else{
            result=JB4DCacheManager.getObject(cacheName,key);
            if(result==null){
                result=builder.BuildObj();
                JB4DCacheManager.put(cacheName,key,result);
                return result;
            }
            return result;
        }
    }
}
