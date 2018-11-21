package com.jbuild4d.web.platform.tools;

import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.web.platform.controller.ControllerTestBase;
import org.ehcache.CacheManager;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockServletContext;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public class JB4DCacheManagerTest extends ControllerTestBase {

    @Test
    public void putToCache(){
        //CacheManager cacheManager = context.getBean(CacheManager.class);
        JB4DCacheManager.put("forUnitTest","1","hello word");
        Assert.assertEquals("获取缓存中的数据","hello word",JB4DCacheManager.get("forUnitTest","1"));
    }
}
