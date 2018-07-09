package com.jbuild4d.base.tools.common;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/6
 * To change this template use File | Settings | File Templates.
 */
public class SQLKeyWordUtility {

    public static boolean validateSqlInjectForSelectOnly(String sqlString) {
        boolean ReturnValue = false;
        try
        {
            if (!sqlString.equals(""))
            {

                sqlString=sqlString.toLowerCase().replaceAll("IS_DELETED","");
                String SqlStrKeyWord = "insert|update|delete|alert|drop|exec|truncate";
                SqlStrKeyWord=SqlStrKeyWord.toLowerCase();
                String[] anySqlStr = SqlStrKeyWord.split("\\|");
                for (String keyWord : anySqlStr) {
                    if(sqlString.indexOf(keyWord)>0){
                        ReturnValue=true;
                    }
                }
            }
        }
        catch(Exception ex)
        {
            throw ex;
        }
        return ReturnValue;
    }

    public static String stringWrap(String source){
        return "'"+source.replaceAll("'","''")+"'";
    }
}
