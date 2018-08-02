package com.jbuild4d.platform.builder.exenum;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/2
 * To change this template use File | Settings | File Templates.
 */
public enum  TableTypeEnum {
    Builder("Builder"),//通过系统设计
    DBDesign("DBDesign");//直接在数据库中设计的

    public String getText() {
        return _nText;
    }

    private String _nText;
    TableTypeEnum(String _nText) {
        this._nText = _nText;
    }
}
