package com.jbuild4d.platform.system.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.exenum.DBTypeEnum;
import com.jbuild4d.base.dbaccess.general.DBProp;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.common.DateUtility;
import com.jbuild4d.base.tools.common.PathUtility;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.platform.system.service.ICodeGenerateService;
import org.apache.poi.ss.formula.functions.T;
import org.jsoup.helper.StringUtil;
import org.mybatis.generatorex.api.MyBatisGenerator;
import org.mybatis.generatorex.config.*;
import org.mybatis.generatorex.config.xml.ConfigurationParser;
import org.mybatis.generatorex.exception.InvalidConfigurationException;
import org.mybatis.generatorex.exception.XMLParserException;
import org.mybatis.generatorex.internal.DefaultShellCallback;

import java.io.*;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/25
 * To change this template use File | Settings | File Templates.
 */
public class CodeGenerateServiceImpl implements ICodeGenerateService {

    ISQLBuilderService sqlBuilderService;
    public CodeGenerateServiceImpl(ISQLBuilderService _sqlBuilderService) {
        sqlBuilderService=_sqlBuilderService;
        //Select Name FROM SysObjects Where XType='U' orDER BY Name
        //DBType=MSSQLSERVER
        //#DBType=ORACLE
        //#DBType=MYSQL
    }

    @Override
    public PageInfo<List<Map<String, Object>>> getTables(JB4DSession jb4DSession, Integer pageNum, Integer pageSize, Map<String, Object> searchMap) {
        String sql="";
        if(DBProp.isSqlServer()){
            sql="Select Name as TableName FROM SysObjects Where XType='U' orDER BY Name";
        }
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<Map<String, Object>> list=sqlBuilderService.selectList(sql);
        PageInfo<List<Map<String, Object>>> pageInfo = new PageInfo(list);
        return pageInfo;
    }

    private String EntityRootFolderKey="EntityRootFolderKey";
    private String DaoRootFolderKey="DaoRootFolderKey";
    private String XmlRootFolderKey="XmlRootFolderKey";
    private Map<String,String> createAboutFolder(){
        String GenerateCodeFilesPath=PathUtility.getWebInfPath()+"/GenerateCodeFiles"+"/"+DateUtility.getDate_yyyyMMddHHmmssSSS();
        File tempRootFolder=new File(GenerateCodeFilesPath);
        tempRootFolder.mkdirs();

        Map<String,String> result=new HashMap<>();
        //Entity
        String tempPath=GenerateCodeFilesPath+"/Entity";
        File temp=new File(tempPath);
        temp.mkdirs();
        result.put(EntityRootFolderKey,tempPath);

        //Dao
        tempPath=GenerateCodeFilesPath+"/Dao";
        temp=new File(tempPath);
        temp.mkdirs();
        result.put(DaoRootFolderKey,tempPath);

        //Xml
        tempPath=GenerateCodeFilesPath+"/XMLACMapper";
        temp=new File(tempPath);
        temp.mkdirs();
        result.put(XmlRootFolderKey,tempPath);

        return result;
    }

    @Override
    public Map<String, String> getTableGenerateCode(JB4DSession jb4DSession, String tableName,String entityPackage,String daoPackage,String xmlPackage) throws FileNotFoundException {
        //根据单表生成代码
        Map<String, String> generateCodeMap = new HashMap<>();
        List<String> warnings = new ArrayList<String>();
        boolean overwrite = true;

        InputStream is = this.getClass().getClassLoader().getResourceAsStream("MybatisGenerator/generatorConfigToCode.xml");

        /*//PathUtility pathUtility=new PathUtility();
        //String generateCodeFilesPath= PathUtility
        //InputStream is=new FileInputStream(configFile);
        String GenerateCodeFilesPath=PathUtility.getWebInfPath()+"/GenerateCodeFiles";

        String tempRootFolderStr= GenerateCodeFilesPath+"/"+DateUtility.getDate_yyyyMMddHHmmssSSS();*/

        Map<String,String> rootPath=createAboutFolder();

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

        Context context = config.getContexts().get(0);
        //设置数据库连接
        JDBCConnectionConfiguration jdbcConnectionConfiguration=new JDBCConnectionConfiguration();
        jdbcConnectionConfiguration.setDriverClass(DBProp.getDriverName());
        jdbcConnectionConfiguration.setConnectionURL(DBProp.getUrl());
        jdbcConnectionConfiguration.setUserId(DBProp.getUser());
        jdbcConnectionConfiguration.setPassword(DBProp.getPassword());
        context.setJdbcConnectionConfiguration(jdbcConnectionConfiguration);

        //设置modelde的相关信息
        JavaModelGeneratorConfiguration javaModelGeneratorConfiguration=context.getJavaModelGeneratorConfiguration();
        javaModelGeneratorConfiguration.setTargetPackage(entityPackage);
        javaModelGeneratorConfiguration.setTargetProject(rootPath.get(EntityRootFolderKey));
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        //设置mapper的相关信息
        SqlMapGeneratorConfiguration sqlMapGeneratorConfiguration=context.getSqlMapGeneratorConfiguration();
        sqlMapGeneratorConfiguration.setTargetPackage(xmlPackage);
        sqlMapGeneratorConfiguration.setTargetProject(rootPath.get(XmlRootFolderKey));
        context.setSqlMapGeneratorConfiguration(sqlMapGeneratorConfiguration);

        //设置dao的相关的信息
        JavaClientGeneratorConfiguration javaClientGeneratorConfiguration=context.getJavaClientGeneratorConfiguration();
        javaClientGeneratorConfiguration.setTargetPackage(daoPackage);
        javaClientGeneratorConfiguration.setTargetProject(rootPath.get(DaoRootFolderKey));
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        String domainObjectName= StringUtility.fisrtCharUpper(tableName)+"Entity";
        String MapperName=StringUtility.fisrtCharUpper(tableName)+"ACMapper";

        if(tableName.indexOf("_")>0){
            String shortName=tableName.split("_")[1];
            domainObjectName=StringUtility.fisrtCharUpper(shortName)+"Entity";
            MapperName=StringUtility.fisrtCharUpper(shortName)+"ACMapper";
        }
        //设置表名称
        TableConfiguration tc = new TableConfiguration(context);
        tc.setTableName(tableName);
        tc.setDomainObjectName(domainObjectName);
        tc.setMapperName(MapperName);
        tc.setCountByExampleStatementEnabled(false);
        tc.setUpdateByExampleStatementEnabled(false);
        tc.setDeleteByExampleStatementEnabled(false);
        tc.setSelectByExampleStatementEnabled(false);
        tc.setDeleteByPrimaryKeyStatementEnabled(false);
        context.addTableConfiguration(tc);

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
        return generateCodeMap;
    }
}
