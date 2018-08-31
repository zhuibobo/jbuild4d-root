package com.jbuild4d.web.platform.controller;

import com.jbuild4d.web.platform.controller.builder.datastorage.database.TableControllerTest;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;


/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/31
 * To change this template use File | Settings | File Templates.
 */
@RunWith(Suite.class)
@Suite.SuiteClasses({
        InitializationSystemControllerTest.class,
        TableControllerTest.class
})
public class TestRunner {

}
