package com.jbuild4d.service;

import com.jbuild4d.platform.builder.service.IDatasetService;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.BuilderBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.DevDemoBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.OrganBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.SystemBeansConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes= {
        MybatisBeansConfig.class,
        SystemBeansConfig.class,
        DevDemoBeansConfig.class,
        OrganBeansConfig.class,
        BuilderBeansConfig.class
})
public class SQLDataSetBuilderTest extends BaseTest {

    @Autowired
    IDatasetService datasetService;

    @Test
    public void singleTableSelectTest()
    {
        DataSetVo dataSetVo=datasetService.resolveSQLToDataSet(jb4DSession,"select * from TDEV_TEST_1");
        System.out.println(dataSetVo.getColumnVoList().size());
    }
}
