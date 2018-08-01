package com.jbuild4d.platform.builder.dbtablebuilder;

import com.jbuild4d.base.dbaccess.dbentities.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.builder.vo.TableFieldVO;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public abstract class TableBuidler {
    ISQLBuilderService sqlBuilderService;

    public ISQLBuilderService getSqlBuilderService() {
        return sqlBuilderService;
    }

    public void setSqlBuilderService(ISQLBuilderService sqlBuilderService) {
        this.sqlBuilderService = sqlBuilderService;
    }

    public BuilderResultMessage newTable(TableEntity tableEntity, List<TableFieldVO> fieldVos){
        try{
            if(fieldVos==null||fieldVos.size()==0){
                return BuilderResultMessage.getFieldsCannotBeNullError();
            }

            //判断是否已经存在同名的表
            if(isExistTable(tableEntity)){
                return BuilderResultMessage.getTableIsExistError(tableEntity.getTableName());
            }

            //String TEMPFIELDZRB="TEMPFIELDZRB";
            try {
                String createTableSQL = buildCreateTableSQL(tableEntity);
                        //"CREATE TABLE " + tableEntity.getTableName() + "("+TEMPFIELDZRB+" VARCHAR(50) NULL)";//使用空的字段创建一个表
                sqlBuilderService.execute(createTableSQL);
            }
            catch (Exception ex){
                ex.printStackTrace();
                return BuilderResultMessage.getCreateTableError(ex);
            }

            //在表中加入表字段
            for (TableFieldEntity fieldEntity : fieldVos) {
                BuilderResultMessage newFieldResult=newField(tableEntity,fieldEntity);
                if(!newFieldResult.isSuccess()){
                    throw new Exception("新增列错误!"+newFieldResult.getMessage());
                }
            }

            createTableEnd(tableEntity);
            //删除掉用于建表是的临时字段
            //String dropTempFieldSQL="alter table "+tableEntity.getTableName()+" drop column "+TEMPFIELDZRB;
            //sqlBuilderService.execute(dropTempFieldSQL);

            return BuilderResultMessage.getSuccess();
        }
        catch (Exception ex){
            //删除表
            ex.printStackTrace();
            deleteTable(tableEntity);
            return BuilderResultMessage.getCreateTableError(ex);
        }
    }

    public BuilderResultMessage updateTable(TableEntity tableEntity,List<TableFieldVO> newFields,List<TableFieldVO> updateFields,List<TableFieldVO> deleteFields){
        try{
            //判断是否存在表
            if(!isExistTable(tableEntity)){
                return BuilderResultMessage.getTableIsNotExistError(tableEntity.getTableName());
            }

            //新增字段
            if(newFields!=null) {
                for (TableFieldEntity fieldEntity : newFields) {
                    BuilderResultMessage newFieldResult = newField(tableEntity, fieldEntity);
                    if (!newFieldResult.isSuccess()) {
                        throw new Exception("新增列错误!" + newFieldResult.getMessage());
                    }
                }
            }

            //修改字段,暂时只是支持修改类型
            if(updateFields!=null) {
                for (TableFieldVO updateField : updateFields) {
                    BuilderResultMessage newFieldResult = this.updateField(tableEntity, updateField);
                    if (!newFieldResult.isSuccess()) {
                        throw new Exception("修改列错误!" + newFieldResult.getMessage());
                    }
                }
            }

            //删除字段
            if(deleteFields!=null) {
                for (TableFieldVO deleteField : deleteFields) {
                    deleteField(tableEntity, deleteField);
                }
            }
        }
        catch (Exception ex){
            ex.printStackTrace();
            return BuilderResultMessage.getUpdateTableError(ex);
        }
        return BuilderResultMessage.getSuccess();
    }

    public BuilderResultMessage deleteTable(TableEntity tableEntity){
        //如果表中已经存在数据,提示需要先手工删除数据后,才能删除物理表.
        if(isExistRecord(tableEntity)){
            return BuilderResultMessage.getTableExistRecordError(tableEntity.getTableName());
        }
        String dropSQL=buildDeleteTableSQL(tableEntity);
                //"drop table "+tableEntity.getTableName();
        try{
            sqlBuilderService.execute(dropSQL);
        }
        catch (Exception ex){
            ex.printStackTrace();
            return BuilderResultMessage.getDeleteTableError(ex);
        }
        return BuilderResultMessage.getSuccess();
    }

    protected abstract String buildDeleteTableSQL(TableEntity tableEntity);

    protected abstract BuilderResultMessage deleteField(TableEntity tableEntity, TableFieldVO deleteField);

    protected abstract BuilderResultMessage updateField(TableEntity tableEntity, TableFieldVO updateField);

    protected abstract BuilderResultMessage newField(TableEntity tableEntity, TableFieldEntity fieldEntity);

    protected abstract void createTableEnd(TableEntity tableEntity);

    protected abstract boolean isExistTable(TableEntity tableEntity);

    protected boolean isExistRecord(TableEntity tableEntity){
        String sql="select count(*) COUNT from "+tableEntity.getTableName();
        Map result=sqlBuilderService.selectOne(sql,tableEntity.getTableName());
        if(Integer.parseInt(result.get("COUNT").toString())==0){
            return false;
        }
        return true;
    }

    protected abstract String buildCreateTableSQL(TableEntity tableEntity);
}
