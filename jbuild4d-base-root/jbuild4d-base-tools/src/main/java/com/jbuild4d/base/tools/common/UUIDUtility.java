package com.jbuild4d.base.tools.common;

import java.util.UUID;

public class UUIDUtility {

    /**
     * 获取UUID
     *
     * @return
     */
    public String getUUID(){
        return  UUID.randomUUID().toString();
    }

    public String getUUIDNotSplit(){
        String uuid=getUUID();
        return uuid.replaceAll("-","");
    }
}

