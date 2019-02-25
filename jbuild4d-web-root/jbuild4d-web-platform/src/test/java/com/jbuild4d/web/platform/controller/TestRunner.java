package com.jbuild4d.web.platform.controller;

import com.jbuild4d.test.web.platform.InitializationSystemRestTest;
import com.jbuild4d.web.platform.beanconfig.sys.RootConfig;
import com.jbuild4d.web.platform.beanconfig.sys.WebConfig;
import com.jbuild4d.test.web.platform.rest.builder.dataset.DataSetGroupRestTest;
import com.jbuild4d.test.web.platform.rest.builder.dataset.DataSetSQLDesignerRestTest;
import com.jbuild4d.test.web.platform.rest.builder.datastorage.database.TableRestTest;
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
        InitializationSystemRestTest.class,
        TableRestTest.class,
        DataSetGroupRestTest.class,
        DataSetSQLDesignerRestTest.class
})
public class TestRunner {

}
