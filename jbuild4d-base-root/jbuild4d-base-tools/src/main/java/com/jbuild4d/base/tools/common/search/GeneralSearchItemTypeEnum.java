package com.jbuild4d.base.tools.common.search;

public enum GeneralSearchItemTypeEnum {

    IntType("整数",1),
    NumberType("小数",2),
    DateType("日期",3),
    StringType("字符串",4),
    LikeStringType("%字符串%",5),
    LeftLikeStringType("%字符串",6),
    RightLikeStringType("字符串%",7),
    DateStringType("日期字符串",8);

    private String _nText;
    private long _nCode;
    GeneralSearchItemTypeEnum(String _nText, int _nCode) {
        this._nText = _nText;
        this._nCode=_nCode;
    }

    public String getText(){
        return this._nText;
    }

    public long getCode(){
        return this._nCode;
    }
}
