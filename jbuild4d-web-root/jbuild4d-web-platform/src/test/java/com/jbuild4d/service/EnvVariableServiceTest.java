package com.jbuild4d.service;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.system.service.IEnvVariableService;
import com.jbuild4d.platform.system.vo.EnvVariableVo;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.BuildBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.DevDemoBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.OrganBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.SystemBeansConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.xml.xpath.XPathExpressionException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/6
 * To change this template use File | Settings | File Templates.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes= {
        MybatisBeansConfig.class,
        SystemBeansConfig.class,
        DevDemoBeansConfig.class,
        OrganBeansConfig.class,
        BuildBeansConfig.class
})
public class EnvVariableServiceTest  extends BaseTest  {

    @Autowired
    IEnvVariableService envVariableService;

    @Test
    public void getDateTimeVarsTest() throws XPathExpressionException {
        List<EnvVariableVo> envVariableVoList=envVariableService.getDateTimeVars();
        for (EnvVariableVo envVariableVo : envVariableVoList) {
            System.out.println(envVariableVo.getText());
            System.out.println(envVariableVo.getParentId());
        }
    }

    @Test
    public void getDateTimeValueTest() throws XPathExpressionException, JBuild4DGenerallyException {
        System.out.println(envVariableService.execEnvVarResult(jb4DSession,"yyyy-mm-dd"));
        System.out.println(envVariableService.execEnvVarResult(jb4DSession,"yyyy/mm/dd"));
    }
}
