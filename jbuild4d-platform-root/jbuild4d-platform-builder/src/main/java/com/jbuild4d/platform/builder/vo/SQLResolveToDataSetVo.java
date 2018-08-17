package com.jbuild4d.platform.builder.vo;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/17
 * To change this template use File | Settings | File Templates.
 */
public class SQLResolveToDataSetVo {
    String sqlWithEnvText;
    String sqlWithEnvValue;
    String sqlWithEnvRunningValue;
    String sqlWithEmptyData;
    DataSetVo dataSetVo;

    public String getSqlWithEnvText() {
        return sqlWithEnvText;
    }

    public void setSqlWithEnvText(String sqlWithEnvText) {
        this.sqlWithEnvText = sqlWithEnvText;
    }

    public String getSqlWithEnvValue() {
        return sqlWithEnvValue;
    }

    public void setSqlWithEnvValue(String sqlWithEnvValue) {
        this.sqlWithEnvValue = sqlWithEnvValue;
    }

    public String getSqlWithEnvRunningValue() {
        return sqlWithEnvRunningValue;
    }

    public void setSqlWithEnvRunningValue(String sqlWithEnvRunningValue) {
        this.sqlWithEnvRunningValue = sqlWithEnvRunningValue;
    }

    public DataSetVo getDataSetVo() {
        return dataSetVo;
    }

    public void setDataSetVo(DataSetVo dataSetVo) {
        this.dataSetVo = dataSetVo;
    }

    public String getSqlWithEmptyData() {
        return sqlWithEmptyData;
    }

    public void setSqlWithEmptyData(String sqlWithEmptyData) {
        this.sqlWithEmptyData = sqlWithEmptyData;
    }
}
