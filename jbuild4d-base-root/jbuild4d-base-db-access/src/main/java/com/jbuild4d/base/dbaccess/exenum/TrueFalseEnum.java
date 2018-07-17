package com.jbuild4d.base.dbaccess.exenum;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/17
 * To change this template use File | Settings | File Templates.
 */
public enum TrueFalseEnum implements BaseEnum<EnableTypeEnum, Integer>{
    True(1,true,"是"),
    False(0,false,"否");

    private Integer value;
    private boolean boolValue;
    private String displayName;

    @Override
    public Integer getValue() {
        return value;
    }

    @Override
    public String getDisplayName() {
        return displayName;
    }

    public boolean getBoolValue(){
        return boolValue;
    }

    private TrueFalseEnum(int value,boolean boolValue,String displayName) {
        this.value=value;
        this.boolValue=boolValue;
        this.displayName=displayName;
    }

    static Map<Integer,TrueFalseEnum> enumMap=new HashMap<Integer, TrueFalseEnum>();
    static{
        for(TrueFalseEnum type: TrueFalseEnum.values()){
            enumMap.put(type.getValue(), type);
        }
    }

    public static TrueFalseEnum getEnum(Integer value) {
        return enumMap.get(value);
    }
}
