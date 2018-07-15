package com.jbuild4d.base.tools.common;

import java.util.UUID;

public class UUIDUtility {

    /**
     * 获取UUID
     *
     * @return
     */
    public static String getUUID(){
        return  UUID.randomUUID().toString();
    }

    public static String getTestPrefix(){
        return "TESTSCOPE-";
    }

    public static String getTestUUID(){
        return  getTestPrefix()+UUID.randomUUID().toString();
    }

    public static String getUUIDNotSplit(){
        String uuid=getUUID();
        return uuid.replaceAll("-","");
    }

    public static String getFullTimeStr(){
        return DateUtility.getDate_yyyyMMddHHmmssSSS();
    }
}

