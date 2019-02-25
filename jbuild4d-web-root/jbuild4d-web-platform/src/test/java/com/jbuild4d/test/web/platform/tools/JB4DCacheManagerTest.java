package com.jbuild4d.test.web.platform.tools;

import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.test.web.platform.RestTestBase;
import org.junit.Assert;
import org.junit.Test;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public class JB4DCacheManagerTest extends RestTestBase {

    @Test
    public void putToCache(){
        //CacheManager cacheManager = context.getBean(CacheManager.class);
        JB4DCacheManager.put("forUnitTest","1","hello word");
        Assert.assertEquals("获取缓存中的数据","hello word",JB4DCacheManager.getString("forUnitTest","1"));
    }
}
