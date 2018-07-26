package com.jbuild4d.base.dbaccess.general;

import com.jbuild4d.base.dbaccess.exenum.DBTypeEnum;

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
            return DBTypeEnum.mysql;
        }
        else if(getValue("DBType").toLowerCase().equals("mysql")){
            return DBTypeEnum.oracle;
        }
        return DBTypeEnum.sqlserver;
    }

    public static String getDriverName(){
        return getValue("DriverName");
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
}
