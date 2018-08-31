package com.jbuild4d.base.exception;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/2
 * To change this template use File | Settings | File Templates.
 */
public class JBuild4DPhysicalTableException extends Exception {

    private static int ErrorCode_CreateTableError=1200000;
    private static int ErrorCode_TableIsExistError =1200001;
    private static int ErrorCode_TableIsExistRecordError =1200002;
    private static int ErrorCode_TableIsNotExistError=1200003;
    private static int ErrorCode_DeleteTableError=1200004;
    private static int ErrorCode_UpdateTableError=1200005;

    private static int ErrorCode_CreateFieldError=1300000;
    private static int ErrorCode_FieldsCannotBeNullError =1300001;
    private static int ErrorCode_FieldTypeNodeSupportError =1300002;

    private int code;
    private String message;

    public JBuild4DPhysicalTableException(int _code,String _message){
        this.code=_code;
        this.message=_message;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static JBuild4DPhysicalTableException getCreateTableError(Exception ex){
        return new JBuild4DPhysicalTableException(JBuild4DPhysicalTableException.ErrorCode_CreateTableError,ex.getMessage());
    }

    public static JBuild4DPhysicalTableException getFieldsCannotBeNullError(){
        return new JBuild4DPhysicalTableException(JBuild4DPhysicalTableException.ErrorCode_FieldsCannotBeNullError,"字段不能为空");
    }

    public static JBuild4DPhysicalTableException getTableIsExistError(String tableName){
        return new JBuild4DPhysicalTableException(JBuild4DPhysicalTableException.ErrorCode_TableIsExistError,"已经存在名称为"+tableName+"的物理表!");
    }


    public static JBuild4DPhysicalTableException getTableIsNotExistError(String tableName) {
        return new JBuild4DPhysicalTableException(JBuild4DPhysicalTableException.ErrorCode_TableIsNotExistError,"已经不存在名称为"+tableName+"的表!");
    }

    public static JBuild4DPhysicalTableException getTableExistRecordError(String tableName) {
        return new JBuild4DPhysicalTableException(JBuild4DPhysicalTableException.ErrorCode_TableIsExistRecordError,"表"+tableName+"中存在记录,请先手工删除该表的记录!");
    }

    public static JBuild4DPhysicalTableException getDeleteTableError(Exception ex){
        return new JBuild4DPhysicalTableException(JBuild4DPhysicalTableException.ErrorCode_DeleteTableError,ex.getMessage());
    }

    public static JBuild4DPhysicalTableException getFieldTypeNodeSupportError(String typeName) {
        return new JBuild4DPhysicalTableException(JBuild4DPhysicalTableException.ErrorCode_FieldTypeNodeSupportError,"不支持字段类型"+typeName+"!");
    }

    public static JBuild4DPhysicalTableException getFieldCreateError() {
        return new JBuild4DPhysicalTableException(JBuild4DPhysicalTableException.ErrorCode_CreateFieldError,"创建物理表字段失败!");
    }

    public static JBuild4DPhysicalTableException getFieldCreateError(Exception ex) {
        return new JBuild4DPhysicalTableException(JBuild4DPhysicalTableException.ErrorCode_CreateFieldError,ex.getMessage());
    }

    public static JBuild4DPhysicalTableException getUpdateTableError(Exception ex) {
        return new JBuild4DPhysicalTableException(JBuild4DPhysicalTableException.ErrorCode_UpdateTableError,ex.getMessage());
    }

}
