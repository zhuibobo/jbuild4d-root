package com.jbuild4d.web.platform.controller;

import com.jbuild4d.web.platform.beanconfig.sys.RootConfig;
import com.jbuild4d.web.platform.beanconfig.sys.WebConfig;
import com.jbuild4d.web.platform.controller.builder.dataset.DataSetSQLDesignerControllerTest;
import com.jbuild4d.web.platform.controller.builder.datastorage.database.TableControllerTest;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.ContextHierarchy;


/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/31
 * To change this template use File | Settings | File Templates.
 */
@RunWith(Suite.class)
@ContextHierarchy({
        @ContextConfiguration(name = "parent", classes = RootConfig.class),
        @ContextConfiguration(name = "child", classes = WebConfig.class)})
@Suite.SuiteClasses({
        InitializationSystemControllerTest.class,
        TableControllerTest.class,
        DataSetSQLDesignerControllerTest.class
})
public class TestRunner {

}
