package com.jbuild4d.base.dbaccess.exenum;

import java.util.HashMap;
import java.util.Map;

public enum EnableTypeEnum implements BaseEnum<EnableTypeEnum, Integer> {
    enable(1,"启用"),
    disable(0,"禁用"),
    delete(2,"删除");

    private Integer value;
    private String displayName;

    static Map<Integer,EnableTypeEnum> enumMap=new HashMap<Integer, EnableTypeEnum>();
    static{
        for(EnableTypeEnum type: EnableTypeEnum.values()){
            enumMap.put(type.getValue(), type);
        }
    }

    private EnableTypeEnum(int value,String displayName) {
        this.value=value;
        this.displayName=displayName;
    }

    public Integer getValue() {
        return value;
    }
    public void setValue(int value) {
        this.value = value;
    }
    public String getDisplayName() {
        return displayName;
    }
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public static EnableTypeEnum getEnum(Integer value) {
        return enumMap.get(value);
    }
}
