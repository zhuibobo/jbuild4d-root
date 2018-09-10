package com.jbuild4d.platform.builder.exenum;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/9/10
 * To change this template use File | Settings | File Templates.
 */
public enum DataSetTypeEnum {
    SQLDataSet("SQLDataSet"),
    APIDataSet("APIDataSet"),
    RESTDataSet("RESTDataSet"),
    CUSTOMDataSet("CUSTOMDataSet");

    public String getText() {
        return _nText;
    }

    private String _nText;
    DataSetTypeEnum(String _nText) {
        this._nText = _nText;
    }
}
