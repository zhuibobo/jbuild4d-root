package com.jbuild4d.web.platform.model;

import java.util.HashMap;
import java.util.Map;

public class JBuild4DResponseVo {
    /**
     * 是否成功
     */
    private boolean success = true;

    /**
     * 消息
     */
    private String message = "";

    /**
     * 错误码
     */
    private Integer errorCode;

    /**
     * 数据
     */
    private Object data;


    private JBuild4DResponseVo(boolean success, String message, Object data, Integer errorCode) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errorCode = errorCode;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Integer getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(Integer errorCode) {
        this.errorCode = errorCode;
    }

    /**
     * 返回SSSResponse实例
     *
     * @return SSSResponse
     */
    public static JBuild4DResponseVo success() {
        return new JBuild4DResponseVo(true, "", null, null);
    }

    /**
     * 返回SSSResponse实例
     *
     * @param message 成功信息
     * @return
     */
    public static JBuild4DResponseVo success(String message) {
        return new JBuild4DResponseVo(true, message, null, null);
    }

    /**
     * 返回SSSResponse实例
     *
     * @param message 成功信息
     * @param data    数据
     * @return
     */
    public static JBuild4DResponseVo success(String message, Object data) {
        return new JBuild4DResponseVo(true, message, data, null);
    }

    public static JBuild4DResponseVo deleteSuccess(){
        return success("删除成功！");
    }

    public static JBuild4DResponseVo saveSuccess(){
        return success("保存成功！");
    }

    public static JBuild4DResponseVo saveSuccess(Object data){
        return success("保存成功！",data);
    }

    public static JBuild4DResponseVo opSuccess(){
        return success("操作成功！");
    }

    public static JBuild4DResponseVo deleteError(){
        return success("删除失败！");
    }

    public static JBuild4DResponseVo saveError(){
        return success("保存失败！");
    }

    public static JBuild4DResponseVo opError(){
        return error("操作失败！");
    }
    /**
     * 返回SSSResponse实例 用于APP普通列表（分页列表还是用success方法）
     *
     * @param message 成功信息
     * @param data    数据
     * @return
     */
    public static JBuild4DResponseVo successMap(String message, Object data) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("results", data);
        return new JBuild4DResponseVo(true, message, map, null);
    }

    /**
     * 返回SSSResponse实例
     *
     * @param message 失败信息
     * @return
     */
    public static JBuild4DResponseVo error(String message) {
        return new JBuild4DResponseVo(false, message, null, null);
    }

    /**
     * 返回SSSResponse实例
     *
     * @param message 失败信息
     * @param data    数据
     * @return
     */
    public static JBuild4DResponseVo error(String message, Object data) {
        return new JBuild4DResponseVo(false, message, data, null);
    }

    /**
     * 返回SSSResponse实例
     *
     * @param sssBaseException 异常
     * @return
     */
    public static JBuild4DResponseVo error(JBuild4DResponseVo sssBaseException) {
        return new JBuild4DResponseVo(false, sssBaseException.getMessage(), null, sssBaseException.getErrorCode());
    }

    /**
     * 返回SSSResponse实例
     *
     * @param sssRunTimeException 异常
     * @return
     *//*
    public static Build4DResponseVo error(SSSRunTimeException sssRunTimeException) {
        return new Build4DResponseVo(false, sssRunTimeException.getMessage(), null, sssRunTimeException.getErrorCode());
    }*/
}
