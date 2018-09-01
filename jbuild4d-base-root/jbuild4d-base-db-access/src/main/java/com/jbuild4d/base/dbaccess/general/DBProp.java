package com.jbuild4d.base.dbaccess.general;

import com.jbuild4d.base.dbaccess.exenum.DBTypeEnum;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class DBProp {
    private static Properties propertie;
    private static final String filePath = "DB.properties";

    static{
        propertie = new Properties();
        try {
            ClassLoader loader = Thread.currentThread().getContextClassLoader();
            try(InputStream resourceStream = loader.getResourceAsStream(filePath)) {
                propertie.load(resourceStream);
            }
        } catch (FileNotFoundException ex) {
            ex.printStackTrace();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public static String getValue(String key) {
        if (propertie.containsKey(key)) {
            String value = propertie.getProperty(key);
            return value;
        } else
            return "";
    }

    public static boolean isSqlServer(){
        return getDBType()==DBTypeEnum.sqlserver;
    }

    public static boolean isMySql(){
        return getDBType()==DBTypeEnum.mysql;
    }

    public static boolean isOracle(){
        return getDBType()==DBTypeEnum.oracle;
    }

    public static DBTypeEnum getDBType(){
        if(getValue("DBType").toLowerCase().equals("sqlserver")){
            return DBTypeEnum.sqlserver;
        }
        else if(getValue("DBType").toLowerCase().equals("oracle")){
            return DBTypeEnum.oracle;
        }
        else if(getValue("DBType").toLowerCase().equals("mysql")){
            return DBTypeEnum.mysql;
        }
        return DBTypeEnum.sqlserver;
    }

    public static String getDriverName(){
        return getValue("DriverName");
    }

    public static String getDatabaseName(){
        return getValue("DatabaseName");
    }

    public static String getUrl(){
        return getValue("Url");
    }

    public static String getUser(){
        return getValue("User");
    }

    public static String getPassword(){
        return getValue("Password");
    }

    public static void validateConfig() throws JBuild4DGenerallyException {
        if(getDBType().equals("")){
            throw new JBuild4DGenerallyException("DB.properties中的DBType不能为空!");
        }
        if(getDriverName().equals("")){
            throw new JBuild4DGenerallyException("DB.properties中的DriverName不能为空!");
        }
        if(getDatabaseName().equals("")){
            throw new JBuild4DGenerallyException("DB.properties中的DatabaseName不能为空!");
        }
        if(getUrl().equals("")){
            throw new JBuild4DGenerallyException("DB.properties中的Url不能为空!");
        }
        if(getUser().equals("")){
            throw new JBuild4DGenerallyException("DB.properties中的User不能为空!");
        }
        if(getPassword().equals("")){
            throw new JBuild4DGenerallyException("DB.properties中的Password不能为空!");
        }
        if (getUrl().toLowerCase().indexOf(getDatabaseName().toLowerCase())<0){
            throw new JBuild4DGenerallyException("请检查DB.properties中的DatabaseName与Url中配置的是否相同!");
        }
    }
}
