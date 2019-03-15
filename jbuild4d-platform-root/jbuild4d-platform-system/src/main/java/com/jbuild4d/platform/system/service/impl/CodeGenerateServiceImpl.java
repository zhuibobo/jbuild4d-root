package com.jbuild4d.platform.system.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.general.DBProp;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.core.base.tools.DateUtility;
import com.jbuild4d.base.tools.PathUtility;
import com.jbuild4d.core.base.tools.StringUtility;
import com.jbuild4d.platform.system.exenum.CodeGenerateTypeEnum;
import com.jbuild4d.platform.system.service.ICodeGenerateService;
import com.jbuild4d.platform.system.service.impl.codegenerate.CGCodeFragment;
import com.jbuild4d.platform.system.service.impl.codegenerate.CGIService;
import com.jbuild4d.platform.system.service.impl.codegenerate.CGMapperEX;
import com.jbuild4d.platform.system.service.impl.codegenerate.CGServiceImpl;
import com.jbuild4d.platform.system.vo.CodeGenerateVo;
import com.jbuild4d.platform.system.vo.SimpleTableFieldVo;
import org.mybatis.generatorex.api.IntrospectedTable;
import org.mybatis.generatorex.api.MyBatisGenerator;
import org.mybatis.generatorex.config.*;
import org.mybatis.generatorex.config.xml.ConfigurationParser;
import org.mybatis.generatorex.exception.InvalidConfigurationException;
import org.mybatis.generatorex.exception.XMLParserException;
import org.mybatis.generatorex.internal.DefaultShellCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
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

    Logger logger= LoggerFactory.getLogger(CodeGenerateServiceImpl.class);

    ISQLBuilderService sqlBuilderService;
    public CodeGenerateServiceImpl(ISQLBuilderService _sqlBuilderService) {
        sqlBuilderService=_sqlBuilderService;
        //Select Name FROM SysObjects Where XType='U' orDER BY Name
        //DBType=MSSQLSERVER
        //#DBType=ORACLE
        //#DBType=MYSQL
    }

    @Override
    public PageInfo<List<Map<String, Object>>> getTables(JB4DSession jb4DSession, Integer pageNum, Integer pageSize, Map<String, Object> searchMap) throws JBuild4DGenerallyException {
        String sql="";

        String searchTableName="%%";
        if(searchMap.size()>0){
            searchTableName="%"+searchMap.get("tableName").toString()+"%";
        }
        if(DBProp.isSqlServer()){
            sql="Select Name as TableName FROM SysObjects Where XType='U' and Name like #{searchTableName} orDER BY Name";
        }
        else if(DBProp.isMySql()){
            sql="select upper(table_name) TableName from information_schema.tables where table_schema='"+DBProp.getDatabaseName()+"' and table_name like #{searchTableName} and table_type='base table' and table_name not in ('DATABASECHANGELOG','DATABASECHANGELOGLOCK')";
        }
        else if(DBProp.isOracle()){
            throw JBuild4DGenerallyException.getNotSupportOracleException();
        }
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<Map<String, Object>> list=sqlBuilderService.selectList(sql,searchTableName);
        PageInfo<List<Map<String, Object>>> pageInfo = new PageInfo(list);
        return pageInfo;
    }

    @Override
    public List<SimpleTableFieldVo> getTableFields(JB4DSession jb4DSession, String tableName) throws JBuild4DGenerallyException {
        String sql="";
        List<SimpleTableFieldVo> result=new ArrayList<>();
        if(DBProp.isSqlServer()){
            sql="SELECT * FROM INFORMATION_SCHEMA.columns WHERE TABLE_NAME=#{tableName}";
        }
        else if(DBProp.isMySql()){
            sql="select * from information_schema.columns where table_schema='"+DBProp.getDatabaseName()+"' and table_name=#{tableName}";
        }
        else if(DBProp.isOracle()){
            throw JBuild4DGenerallyException.getNotSupportOracleException();
        }
        List<Map<String, Object>> fieldList=sqlBuilderService.selectList(sql,tableName);
        for (Map<String, Object> map : fieldList) {
            SimpleTableFieldVo simpleTableFieldVo=new SimpleTableFieldVo();
            simpleTableFieldVo.setTableName(map.get("TABLE_NAME").toString());
            simpleTableFieldVo.setFieldName(map.get("COLUMN_NAME").toString());
            simpleTableFieldVo.setFieldType(map.get("DATA_TYPE").toString());
            result.add(simpleTableFieldVo);
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
    public Map<String, String> getTableGenerateCode(JB4DSession jb4DSession, String tableName,String orderFieldName,String statusFieldName,String packageType,String packageLevel2Name) throws IOException, ParserConfigurationException, SAXException, XPathExpressionException {
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

        //设置model的相关信息
        JavaModelGeneratorConfiguration javaModelGeneratorConfiguration=context.getJavaModelGeneratorConfiguration();
        String modelPackageName=codeGenerateVoMap.get(CodeGenerateTypeEnum.Entity).packageName+"."+packageLevel2Name;
        javaModelGeneratorConfiguration.setTargetPackage(modelPackageName);
        javaModelGeneratorConfiguration.setTargetProject(codeGenerateVoMap.get(CodeGenerateTypeEnum.Entity).getFullSavePath());
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        //设置dao的相关的信息
        JavaClientGeneratorConfiguration javaClientGeneratorConfiguration=context.getJavaClientGeneratorConfiguration();
        String daoPackageName=codeGenerateVoMap.get(CodeGenerateTypeEnum.Dao).packageName+"."+packageLevel2Name;
        javaClientGeneratorConfiguration.setTargetPackage(daoPackageName);
        javaClientGeneratorConfiguration.setTargetProject(codeGenerateVoMap.get(CodeGenerateTypeEnum.Dao).getFullSavePath());
        context.setJavaModelGeneratorConfiguration(javaModelGeneratorConfiguration);

        //设置mapper的相关信息
        SqlMapGeneratorConfiguration sqlMapGeneratorConfiguration=context.getSqlMapGeneratorConfiguration();
        String mapperPackageName=codeGenerateVoMap.get(CodeGenerateTypeEnum.MapperAC).packageName+"."+packageLevel2Name;
        sqlMapGeneratorConfiguration.setTargetPackage(mapperPackageName);
        sqlMapGeneratorConfiguration.setTargetProject(codeGenerateVoMap.get(CodeGenerateTypeEnum.MapperAC).getFullSavePath());
        context.setSqlMapGeneratorConfiguration(sqlMapGeneratorConfiguration);

        String domainObjectName= StringUtility.fisrtCharUpperThenLower(tableName)+"Entity";
        String mapperName=StringUtility.fisrtCharUpperThenLower(tableName)+"ACMapper";
        String daoMapperName=StringUtility.fisrtCharUpperThenLower(tableName)+"Mapper";

        if(tableName.indexOf("_")>0){
            //String shortName=tableName.substring(tableName.indexOf("_")+1);
            String name="";
            String[] names=tableName.split("_");
            for(int i=1;i<names.length;i++){
                name+=StringUtility.fisrtCharUpperThenLower(names[i]);
            }
            domainObjectName=name+"Entity";
            mapperName=name+"ACMapper";
            daoMapperName=name+"Mapper";
        }
        //设置表名称
        TableConfiguration tc = new TableConfiguration(context);
        tc.setTableName(tableName);
        tc.setDomainObjectName(domainObjectName);
        tc.setMapperName(mapperName);
        tc.setCountByExampleStatementEnabled(false);
        tc.setUpdateByExampleStatementEnabled(false);
        tc.setDeleteByExampleStatementEnabled(false);
        tc.setSelectByExampleStatementEnabled(false);
        //tc.setDeleteByPrimaryKeyStatementEnabled(false);
        context.addTableConfiguration(tc);

        try {
            myBatisGenerator = new MyBatisGenerator(config, callback, warnings);
        } catch (InvalidConfigurationException e) {
            e.printStackTrace();
        }
        try {
            myBatisGenerator.generate(null);
        } catch (SQLException e) {
            logger.error("---------------------------MyBatisGenerator Error---------------------------");
            e.printStackTrace();
        } catch (IOException e) {
            logger.error("---------------------------MyBatisGenerator Error---------------------------");
            e.printStackTrace();
        } catch (InterruptedException e) {
            logger.error("---------------------------MyBatisGenerator Error---------------------------");
            e.printStackTrace();
        }

        //读取文件作为结果返回
        //Entity文件
        String tempPath=codeGenerateVoMap.get(CodeGenerateTypeEnum.Entity).fullSavePath+"/"+modelPackageName.replaceAll("\\.","/");
        logger.info("Entity生成路径:"+tempPath);
        generateCodeMap.put("EntityContent",readFolderSingleFileToString(tempPath));

        //判断是否生成了二进制的继承实体文件;
        if(existBLOBEntity(tempPath)){
            generateCodeMap.put("EntityWithBLOBContent",readWithBLOBsFileToString(tempPath));
        }
        else {
            generateCodeMap.put("EntityWithBLOBContent","不存在二进制字段!");
        }

        tempPath=codeGenerateVoMap.get(CodeGenerateTypeEnum.Dao).fullSavePath+"/"+daoPackageName.replaceAll("\\.","/");
        logger.info("DAO生成路径:"+tempPath);
        generateCodeMap.put("DaoContent",readFolderSingleFileToString(tempPath));

        tempPath=codeGenerateVoMap.get(CodeGenerateTypeEnum.MapperAC).fullSavePath+"/"+mapperPackageName.replaceAll("\\.","/");
        logger.info("MAPPER生成路径:"+tempPath);
        generateCodeMap.put("MapperACContent",readFolderSingleFileToString(tempPath));

        logger.info("---------------------------打印表信息---------------------------");
        List<IntrospectedTable> introspectedTableList=context.getIntrospectedTables();
        for (IntrospectedTable introspectedTable : introspectedTableList) {
            logger.info(introspectedTable.getFullyQualifiedTable().getIntrospectedTableName());
        }
        logger.info("---------------------------打印表信息---------------------------");

        //生成MapperEX
        logger.info("---------------------------生成MapperEX---------------------------");
        String keyFieldName=introspectedTableList.get(0).getPrimaryKeyColumns().get(0).getActualColumnName();
        logger.info("---------------------------生成MapperEX:主键为"+keyFieldName+"---------------------------");
        IntrospectedTable introspectedTable=introspectedTableList.get(0);
        logger.info("---------------------------生成MapperEX:生成列数为"+introspectedTable.getNonPrimaryKeyColumns().size()+"---------------------------");

        generateCodeMap.put("MapperEXContent", CGMapperEX.generate(keyFieldName,introspectedTable,tableName,orderFieldName,statusFieldName,codeGenerateVoMap,generateCodeMap.get("MapperACContent")));
        //生成IService
        logger.info("---------------------------生成IService---------------------------");
        generateCodeMap.put("IServiceContent", CGIService.generate(introspectedTableList,tableName,orderFieldName,statusFieldName,codeGenerateVoMap,generateCodeMap.get("MapperACContent")));
        //生成ServiceImpl
        logger.info("---------------------------生成ServiceImpl---------------------------");
        generateCodeMap.put("ServiceImplContent", CGServiceImpl.generate(introspectedTableList,tableName,orderFieldName,statusFieldName,codeGenerateVoMap,generateCodeMap.get("MapperACContent"),daoMapperName));
        //生成Js实体片段
        generateCodeMap.put("CodeFragmentContent", CGCodeFragment.generate(introspectedTableList,tableName,orderFieldName,statusFieldName,codeGenerateVoMap,generateCodeMap.get("MapperACContent"),daoMapperName));
        //生成ListHTML


        //生成DetailHTML


        return generateCodeMap;
    }

    private boolean existBLOBEntity(String folder){
        File file=new File(folder);
        if(file.exists()){
            File[] files=file.listFiles();
            if(files.length>0){
                for (File file1 : files) {
                    if(file1.getName().indexOf("WithBLOBs")>0){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private String readWithBLOBsFileToString(String folder){
        File file=new File(folder);
        String result="";
        if(file.exists()){
            File[] files=file.listFiles();
            if(files.length>0){
                for (File file1 : files) {
                    if(file1.getName().indexOf("WithBLOBs")>0){
                        return getFileToString(file1);
                    }
                }
            }
        }
        return result;
    }

    private String getFileToString(File file) {
        Long filelength = file.length();
        byte[] filecontent = new byte[filelength.intValue()];
        try {
            FileInputStream in = new FileInputStream(file);
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

    private String readFolderSingleFileToString(String folder){
        File file=new File(folder);
        if(file.exists()){
            File[] files=file.listFiles();
            if(files.length>0){
                File singleFile=files[0];
                return getFileToString(singleFile);
            }
        }
        return "";
    }
}
