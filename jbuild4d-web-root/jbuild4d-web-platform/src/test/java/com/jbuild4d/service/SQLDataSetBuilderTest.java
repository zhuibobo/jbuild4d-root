package com.jbuild4d.service;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.builder.service.IDatasetService;
import com.jbuild4d.platform.builder.vo.DataSetColumnVo;
import com.jbuild4d.platform.builder.vo.DataSetRelatedTableVo;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import com.jbuild4d.web.platform.beanconfig.jdbctemplate.JdbcTemplateBeansConfig;
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
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes= {
        MybatisBeansConfig.class,
        JdbcTemplateBeansConfig.class,
        SystemBeansConfig.class,
        DevDemoBeansConfig.class,
        OrganBeansConfig.class,
        BuilderBeansConfig.class
})
public class SQLDataSetBuilderTest extends BaseTest {

    @Autowired
    IDatasetService datasetService;

    private void PrintDataSetInfo(DataSetVo dataSetVo) {
        System.out.println("--------------------------------------------------------------------------------------");
        System.out.println("--------------------相关字段----------------------");
        for (DataSetColumnVo columnVo : dataSetVo.getColumnVoList()) {
            System.out.println(columnVo.getColumnName()+":"+columnVo.getColumnCaption());
        }
        System.out.println("--------------------相关表----------------------");
        for (DataSetRelatedTableVo dataSetRelatedTableVo : dataSetVo.getRelatedTableVoList()) {
            System.out.println(dataSetRelatedTableVo.getRtTableName()+":"+dataSetRelatedTableVo.getRtTableCaption());
        }
        System.out.println("--------------------------------------------------------------------------------------");
    }

    @Test
    public void singleTableSelectTest() throws SAXException, ParserConfigurationException, XPathExpressionException, IOException {
        DataSetVo dataSetVo= null;
        try {
            dataSetVo = datasetService.resolveSQLToDataSet(jb4DSession,"select * from TDEV_TEST_1");
        } catch (JBuild4DGenerallyException e) {
            e.printStackTrace();
        }
        PrintDataSetInfo(dataSetVo);
    }

    @Test
    public void join2TableSelectTest() throws SAXException, ParserConfigurationException, XPathExpressionException, IOException {
        //存在重复字段，提示错误
        DataSetVo dataSetVo= null;
        try {
            dataSetVo = datasetService.resolveSQLToDataSet(jb4DSession,"select * from TDEV_TEST_1 join TDEV_TEST_2 on TDEV_TEST_1.ID=TDEV_TEST_2.F_TABLE1_ID");
        } catch (JBuild4DGenerallyException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void singleTable2Select() throws SAXException, ParserConfigurationException, XPathExpressionException, IOException {
        DataSetVo dataSetVo= null;
        try {
            //提示错误
            datasetService.resolveSQLToDataSet(jb4DSession,"select * from TDEV_TEST_1;select * from TDEV_TEST_1");
        } catch (JBuild4DGenerallyException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void singleTableDelete() throws SAXException, ParserConfigurationException, XPathExpressionException, IOException {
        DataSetVo dataSetVo= null;
        try {
            //提示错误
            datasetService.resolveSQLToDataSet(jb4DSession,"delete from TDEV_TEST_1");
        } catch (JBuild4DGenerallyException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void join2TableSelectTestSuc() throws SAXException, ParserConfigurationException, XPathExpressionException, IOException {
        DataSetVo dataSetVo= null;
        try {
            dataSetVo = datasetService.resolveSQLToDataSet(jb4DSession,"select TDEV_TEST_1.*,TDEV_TEST_2.F_TABLE1_ID,'address' address,'sex' sex from TDEV_TEST_1 join TDEV_TEST_2 on TDEV_TEST_1.ID=TDEV_TEST_2.F_TABLE1_ID");
        } catch (JBuild4DGenerallyException e) {
            e.printStackTrace();
        }
        PrintDataSetInfo(dataSetVo);
    }

    @Test
    public void validateDataSetSQLEnable() throws SAXException, ParserConfigurationException, XPathExpressionException, IOException {
        try {
            String sqlValue = datasetService.sqlTextReplaceEnvText(jb4DSession,"select TDEV_TEST_1.*,TDEV_TEST_2.F_TABLE1_ID,'address' address,'sex' sex from TDEV_TEST_1 " +
                    "join TDEV_TEST_2 on TDEV_TEST_1.ID=TDEV_TEST_2.F_TABLE1_ID where TDEV_TEST_1.ID='#{ApiVar.当前用户所在组织ID}'");
            System.out.println(sqlValue);
            String sqlRunValue=datasetService.resolveSQLEnvValueToRunValue(jb4DSession,sqlValue);
            System.out.println(sqlRunValue);
            String sqlRunValueNotData=datasetService.resolveSQLToEmptyData(jb4DSession,sqlRunValue);
            System.out.println(sqlRunValueNotData);
            DataSetVo dataSetVo=datasetService.resolveSQLToDataSet(jb4DSession,sqlRunValueNotData);
            PrintDataSetInfo(dataSetVo);

        } catch (JBuild4DGenerallyException e) {
            e.printStackTrace();
        }
    }
}
