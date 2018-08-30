package com.jbuild4d.back.service;

import com.jbuild4d.base.service.general.JB4DSession;
import org.junit.Before;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/17
 * To change this template use File | Settings | File Templates.
 */
public class BaseTest {
    JB4DSession jb4DSession;

    @Before
    public void before() {
        System.out.println("@Before");
        jb4DSession=new JB4DSession();
        jb4DSession.setOrganName("单元测试");
        jb4DSession.setUserName("单元测试");
        jb4DSession.setOrganId("0");
        jb4DSession.setUserId("0");
    }
}
