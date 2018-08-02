package com.jbuild4d.platform.builder.dbtablebuilder;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public class BuilderResultMessage {

    /*private static String SuccessCode="100000";

    private static String ErrorCode_CreateTableError="200000";
    private static String ErrorCode_TableIsExistError ="200001";
    private static String ErrorCode_TableIsExistRecordError ="200002";
    private static String ErrorCode_TableIsNotExistError="200003";
    private static String ErrorCode_DeleteTableError="200004";
    private static String ErrorCode_UpdateTableError="200005";

    private static String ErrorCode_CreateFieldError="300000";
    private static String ErrorCode_FieldsCannotBeNullError ="300001";
    private static String ErrorCode_FieldTypeNodeSupportError ="300002";



    private boolean success;
    private String code;
    private String message;

    public BuilderResultMessage(boolean _success,String _code,String _message){
        this.code=_code;
        this.message=_message;
        this.success=_success;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public static BuilderResultMessage getSuccess(){
        return new BuilderResultMessage(true,"000000","操作成功!");
    }

    public static BuilderResultMessage getCreateTableError(Exception ex){
        return new BuilderResultMessage(false,BuilderResultMessage.ErrorCode_CreateTableError,ex.getMessage());
    }

    public static BuilderResultMessage getFieldsCannotBeNullError(){
        return new BuilderResultMessage(false,BuilderResultMessage.ErrorCode_FieldsCannotBeNullError,"字段不能为空");
    }

    public static BuilderResultMessage getTableIsExistError(String tableName){
        return new BuilderResultMessage(false,BuilderResultMessage.ErrorCode_TableIsExistError,"已经存在名称为"+tableName+"的表!");
    }


    public static BuilderResultMessage getTableIsNotExistError(String tableName) {
        return new BuilderResultMessage(false,BuilderResultMessage.ErrorCode_TableIsNotExistError,"已经不存在名称为"+tableName+"的表!");
    }

    public static BuilderResultMessage getTableExistRecordError(String tableName) {
        return new BuilderResultMessage(false,BuilderResultMessage.ErrorCode_TableIsExistRecordError,"表"+tableName+"中存在记录,请先手工删除该表的记录!");
    }

    public static BuilderResultMessage getDeleteTableError(Exception ex){
        return new BuilderResultMessage(false,BuilderResultMessage.ErrorCode_DeleteTableError,ex.getMessage());
    }

    public static BuilderResultMessage getFieldTypeNodeSupportError(String typeName) {
        return new BuilderResultMessage(false,BuilderResultMessage.ErrorCode_FieldTypeNodeSupportError,"不支持字段类型"+typeName+"!");
    }

    public static BuilderResultMessage getFieldCreateError(Exception ex) {
        return new BuilderResultMessage(false,BuilderResultMessage.ErrorCode_CreateFieldError,ex.getMessage());
    }

    public static BuilderResultMessage getUpdateTableError(Exception ex) {
        return new BuilderResultMessage(false,BuilderResultMessage.ErrorCode_UpdateTableError,ex.getMessage());
    }*/
}
