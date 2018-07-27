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
import com.jbuild4d.platform.system.exenum.CodeGenerateTypeEnum;
import com.jbuild4d.platform.system.service.ICodeGenerateService;
import com.jbuild4d.platform.system.vo.CodeGenerateVo;
import com.jbuild4d.platform.system.vo.SimpleTableFieldVo;
import org.apache.poi.ss.formula.functions.T;
import org.jsoup.helper.StringUtil;
import org.mybatis.generatorex.api.IntrospectedTable;
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

    @Override
    public List<SimpleTableFieldVo> getTableFields(JB4DSession jb4DSession,String tableName){
        String sql="";
        List<SimpleTableFieldVo> result=new ArrayList<>();
        if(DBProp.isSqlServer()){
            sql="SELECT * FROM INFORMATION_SCHEMA.columns WHERE TABLE_NAME=#{tableName}";
            List<Map<String, Object>> fieldList=sqlBuilderService.selectList(sql,tableName);
            for (Map<String, Object> map : fieldList) {
                SimpleTableFieldVo simpleTableFieldVo=new SimpleTableFieldVo();
                simpleTableFieldVo.setTableName(map.get("TABLE_NAME").toString());
                simpleTableFieldVo.setFieldName(map.get("COLUMN_NAME").toString());
                simpleTableFieldVo.setFieldType(map.get("DATA_TYPE").toString());
                result.add(simpleTableFieldVo);
            }
        }
        return result;
    }

    private String EntityRootFolderKey="EntityRootFolderKey";
    private String DaoRootFolderKey="DaoRootFolderKey";
    private String XmlRootFolderKey="XmlRootFolderKey";
    private Map<CodeGenerateTypeEnum,CodeGenerateVo> createAboutFolder(Map<CodeGenerateTypeEnum,CodeGenerateVo> codeGenerateVoMap){
        String GenerateCodeFilesPath=PathUtility.getWebInfPath()+"/GenerateCodeFiles"+"/"+DateUtility.getDate_yyyyMMddHHmmssSSS();
        File tempRootFolder=new File(GenerateCodeFilesPath);
        tempRootFolder.mkdirs();

        Map<String,String> result=new HashMap<>();
        //Entity
        String tempPath=GenerateCodeFilesPath+"/"+codeGenerateVoMap.get(CodeGenerateTypeEnum.Entity).saveFolderName;
        File temp=new File(tempPath);
        temp.mkdirs();
        codeGenerateVoMap.get(CodeGenerateTypeEnum.Entity).setFullSavePath(tempPath);
        //result.put(EntityRootFolderKey,tempPath);

        //Dao
        tempPath=GenerateCodeFilesPath+"/"+codeGenerateVoMap.get(CodeGenerateTypeEnum.Dao).saveFolderName;
        temp=new File(tempPath);
        temp.mkdirs();
        codeGenerateVoMap.get(CodeGenerateTypeEnum.Dao).setFullSavePath(tempPath);

        //XmlMapperAC
        tempPath=GenerateCodeFilesPath+"/"+codeGenerateVoMap.get(CodeGenerateTypeEnum.MapperAC).saveFolderName;
        temp=new File(tempPath);
        temp.mkdirs();
        codeGenerateVoMap.get(CodeGenerateTypeEnum.MapperAC).setFullSavePath(tempPath);

        return codeGenerateVoMap;
    }

    @Override
    public Map<String, String> getTableGenerateCode(JB4DSession jb4DSession, String tableName,String packageType) throws FileNotFoundException {
        //根据单表生成代码
        Map<String, String> generateCodeMap = new HashMap<>();
        List<String> warnings = new ArrayList<String>();
        boolean overwrite = true;

        InputStream is = this.getClass().getClassLoader().getResourceAsStream("MybatisGenerator/generatorConfigToCode.xml");

        Map<CodeGenerateTypeEnum,CodeGenerateVo> codeGenerateVoMap=CodeGenerateVo.generateTypeEnumCodeGenerateVoMap().get(packageType);

        codeGenerateVoMap=createAboutFolder(codeGenerateVoMap);

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
        javaModelGeneratorConfiguration.setTargetPackage(codeGenerateVoMap.get(CodeGenerateTypeEnum.Entity).packageName);
        javaModelGeneratorConfiguration.setTargetProject(codeGenerateVoMap.get(CodeGenerateTypeEnum.Entity).getFullSavePath());
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        //设置dao的相关的信息
        JavaClientGeneratorConfiguration javaClientGeneratorConfiguration=context.getJavaClientGeneratorConfiguration();
        javaClientGeneratorConfiguration.setTargetPackage(codeGenerateVoMap.get(CodeGenerateTypeEnum.Dao).packageName);
        javaClientGeneratorConfiguration.setTargetProject(codeGenerateVoMap.get(CodeGenerateTypeEnum.Dao).getFullSavePath());
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        //设置mapper的相关信息
        SqlMapGeneratorConfiguration sqlMapGeneratorConfiguration=context.getSqlMapGeneratorConfiguration();
        sqlMapGeneratorConfiguration.setTargetPackage(codeGenerateVoMap.get(CodeGenerateTypeEnum.MapperAC).packageName);
        sqlMapGeneratorConfiguration.setTargetProject(codeGenerateVoMap.get(CodeGenerateTypeEnum.MapperAC).getFullSavePath());
        context.setSqlMapGeneratorConfiguration(sqlMapGeneratorConfiguration);

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

        System.out.println("---------------------------打印表信息---------------------------");
        List<IntrospectedTable> introspectedTableList=context.getIntrospectedTables();
        for (IntrospectedTable introspectedTable : introspectedTableList) {
            System.out.println(introspectedTable.getFullyQualifiedTable().getIntrospectedTableName());
        }
        System.out.println("---------------------------打印表信息---------------------------");


        //读取文件作为结果返回
        //Entity文件
        String tempPath=codeGenerateVoMap.get(CodeGenerateTypeEnum.Entity).fullSavePath+"/"+codeGenerateVoMap.get(CodeGenerateTypeEnum.Entity).packageName.replaceAll("\\.","/");
        generateCodeMap.put("EntityContent",readFolderSingleFileToString(tempPath));

        tempPath=codeGenerateVoMap.get(CodeGenerateTypeEnum.Dao).fullSavePath+"/"+codeGenerateVoMap.get(CodeGenerateTypeEnum.Dao).packageName.replaceAll("\\.","/");
        generateCodeMap.put("DaoContent",readFolderSingleFileToString(tempPath));

        tempPath=codeGenerateVoMap.get(CodeGenerateTypeEnum.MapperAC).fullSavePath+"/"+codeGenerateVoMap.get(CodeGenerateTypeEnum.MapperAC).packageName.replaceAll("\\.","/");
        generateCodeMap.put("MapperACContent",readFolderSingleFileToString(tempPath));

        return generateCodeMap;
    }

    private String readFolderSingleFileToString(String folder){
        File file=new File(folder);
        if(file.exists()){
            File[] files=file.listFiles();
            if(files.length>0){
                File singleFile=files[0];
                Long filelength = singleFile.length();
                byte[] filecontent = new byte[filelength.intValue()];
                try {
                    FileInputStream in = new FileInputStream(singleFile);
                    in.read(filecontent);
                    in.close();
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                try {
                    return new String(filecontent, "utf-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                    return null;
                }
            }
        }
        return "";
    }
}
