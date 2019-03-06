package com.jbuild4d.base.service.general;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/21
 * To change this template use File | Settings | File Templates.
 */
public class JBuild4DProp {
    private static Properties propertie;

    static{
        propertie = new Properties();
        try {
            ClassLoader loader = Thread.currentThread().getContextClassLoader();
            try(InputStream resourceStream = loader.getResourceAsStream("JBuild4D.properties")) {
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

    public static String getHostOperationSystem(){
        return getValue("HostOperationSystem");
    }

    public static boolean hostOperationSystemIsWindow(){
        return getHostOperationSystem().toLowerCase().equals("window");
    }

    public static String getWarningOperationCode(){
        return getValue("WarningOperationCode");
    }
}
