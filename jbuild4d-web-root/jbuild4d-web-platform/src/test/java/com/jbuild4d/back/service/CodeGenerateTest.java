package com.jbuild4d.back.service;

import org.junit.Test;
import org.mybatis.generatorex.api.MyBatisGenerator;
import org.mybatis.generatorex.config.Configuration;
import org.mybatis.generatorex.config.Context;
import org.mybatis.generatorex.config.TableConfiguration;
import org.mybatis.generatorex.config.xml.ConfigurationParser;
import org.mybatis.generatorex.exception.InvalidConfigurationException;
import org.mybatis.generatorex.exception.XMLParserException;
import org.mybatis.generatorex.internal.DefaultShellCallback;

import java.io.*;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/25
 * To change this template use File | Settings | File Templates.
 */
public class CodeGenerateTest {

    @Test
    public void testCodeGenerate() throws IOException {
        List<String> warnings = new ArrayList<String>();
        boolean overwrite = true;
        String genCfg = "D:/JavaProject/SelfProject/jbuild4d-project/jbuild4d-root/libs/MybatisGenerator/generatorConfigToCode.xml";
        File configFile = new File(genCfg);
        InputStream is=new FileInputStream(configFile);
        /*BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        System.out.println(reader.readLine());
        System.out.println(reader.readLine());
        System.out.println(reader.readLine());
        System.out.println(reader.readLine());
        System.out.println(reader.readLine());
        System.out.println(reader.readLine());*/

        ConfigurationParser cp = new ConfigurationParser(warnings);
        Configuration config = null;
        try {
            config = cp.parseConfiguration(is);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (XMLParserException e) {
            e.printStackTrace();
        }
        DefaultShellCallback callback = new DefaultShellCallback(overwrite);
        MyBatisGenerator myBatisGenerator = null;

        //设置表名称
        for (Context context : config.getContexts()) {
            TableConfiguration tc=new TableConfiguration(context);
            //<table
            // tableName="TB4D_MENU"
            // domainObjectName="MenuEntity"
            // mapperName="MenuACMapper"
            // enableCountByExample="false"
            // enableUpdateByExample="false"
            // enableDeleteByExample="false"
            // enableSelectByExample="false"
            // selectByExampleQueryId="false">
            //</table>
            tc.setTableName("TB4D_MENU");
            tc.setDomainObjectName("MenuEntity");
            tc.setMapperName("MenuACMapper");
            /*tc.setCountByExampleStatementEnabled(false);
            tc.setUpdateByExampleStatementEnabled(false);
            tc.setDeleteByExampleStatementEnabled(false);
            tc.setSelectByExampleStatementEnabled(false);
            tc.setDeleteByPrimaryKeyStatementEnabled(false);*/
            context.addTableConfiguration(tc);
        }

        try {
            myBatisGenerator = new MyBatisGenerator(config, callback, warnings);
        } catch (InvalidConfigurationException e) {
            e.printStackTrace();
        }
        try {
            myBatisGenerator.generate(null);
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
