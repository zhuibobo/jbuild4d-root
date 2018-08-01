package com.jbuild4d.platform.builder.dbtablebuilder;

import com.jbuild4d.base.dbaccess.dbentities.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.vo.TableFieldVO;

import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public class MSSQLTableBuilder {

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

            String TEMPFIELDZRB="TEMPFIELDZRB";
            try {
                String createTableSQL = "CREATE TABLE " + tableEntity.getTableName() + "("+TEMPFIELDZRB+" VARCHAR(50) NULL)";//使用空的字段创建一个表
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

            //删除掉用于建表是的临时字段
            String dropTempFieldSQL="alter table "+tableEntity.getTableName()+" drop column "+TEMPFIELDZRB;
            sqlBuilderService.execute(dropTempFieldSQL);

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
            for (TableFieldEntity fieldEntity : newFields) {
                BuilderResultMessage newFieldResult=newField(tableEntity,fieldEntity);
                if(!newFieldResult.isSuccess()){
                    throw new Exception("新增列错误!"+newFieldResult.getMessage());
                }
            }

            //修改字段,暂时只是支持修改类型
            for (TableFieldVO updateField : updateFields) {
                BuilderResultMessage newFieldResult=this.updateField(tableEntity,updateField);
                    if(!newFieldResult.isSuccess()){
                        throw new Exception("修改列错误!"+newFieldResult.getMessage());
                    }
            }

            //删除字段
            for (TableFieldVO deleteField : deleteFields) {
                deleteField(tableEntity,deleteField);
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
        String dropSQL="drop table "+tableEntity.getTableName();
        try{
            sqlBuilderService.execute(dropSQL);
        }
        catch (Exception ex){
            ex.printStackTrace();
            return BuilderResultMessage.getDeleteTableError(ex);
        }
        return BuilderResultMessage.getSuccess();
    }

    private boolean isExistTable(TableEntity tableEntity) {
        String sql="Select Name as TableName FROM SysObjects Where XType='U' and Name=#{name}";
        Map result=sqlBuilderService.selectOne(sql,tableEntity.getTableName());
        if(result==null||result.size()==0){
            return false;
        }
        return true;
    }

    private boolean isExistRecord(TableEntity tableEntity){
        String sql="select count(*) COUNT from "+tableEntity.getTableName();
        Map result=sqlBuilderService.selectOne(sql,tableEntity.getTableName());
        if(Integer.parseInt(result.get("COUNT").toString())==0){
            return false;
        }
        return true;
    }

    private BuilderResultMessage newField(TableEntity tableEntity,TableFieldEntity fieldEntity){
        try
        {
            StringBuilder sqlBuilder=new StringBuilder();
            sqlBuilder.append("alter table ");
            sqlBuilder.append(tableEntity.getTableName()+" add "+fieldEntity.getFieldName());
            if(TableFieldTypeEnum.IntType.getValue().equals(fieldEntity.getFieldDataType())){
                sqlBuilder.append(" int ");
            }
            else if(TableFieldTypeEnum.NumberType.getValue().equals(fieldEntity.getFieldDataType())){
                sqlBuilder.append(" decimal("+fieldEntity.getFieldDataLength().toString()+","+fieldEntity.getFieldDecimalLength().toString()+") ");
            }
            else if(TableFieldTypeEnum.DataTimeType.getValue().equals(fieldEntity.getFieldDataType())){
                sqlBuilder.append(" datetime ");
            }
            else if(TableFieldTypeEnum.NVarCharType.getValue().equals(fieldEntity.getFieldDataType())){
                sqlBuilder.append(" nvarchar("+fieldEntity.getFieldDataLength().toString()+") ");
            }
            else if(TableFieldTypeEnum.TextType.getValue().equals(fieldEntity.getFieldDataType())){
                sqlBuilder.append(" ntext ");
            }
            else {
                return BuilderResultMessage.getFieldTypeNodeSupportError(fieldEntity.getFieldDataType());
            }

            if(TrueFalseEnum.True.getDisplayName().equals(fieldEntity.getFieldIsPk())){
                sqlBuilder.append(" NOT NULL PRIMARY KEY");
            }
            else if(TrueFalseEnum.False.getDisplayName().equals(fieldEntity.getFieldAllowNull())){
                sqlBuilder.append(" NOT NULL");
            }

            sqlBuilderService.execute(sqlBuilder.toString());
            return BuilderResultMessage.getSuccess();
        }
        catch (Exception ex){
            ex.printStackTrace();
            return BuilderResultMessage.getFieldCreateError(ex);
        }
    }

    private BuilderResultMessage updateField(TableEntity tableEntity,TableFieldVO fieldVO){
        try
        {
            StringBuilder sqlBuilder=new StringBuilder();
            sqlBuilder.append("alter table ");
            sqlBuilder.append(tableEntity.getTableName()+" alter "+fieldVO.getFieldName());
            if(TableFieldTypeEnum.IntType.getValue().equals(fieldVO.getFieldDataType())){
                sqlBuilder.append(" int ");
            }
            else if(TableFieldTypeEnum.NumberType.getValue().equals(fieldVO.getFieldDataType())){
                sqlBuilder.append(" decimal("+fieldVO.getFieldDataLength().toString()+","+fieldVO.getFieldDecimalLength().toString()+") ");
            }
            else if(TableFieldTypeEnum.DataTimeType.getValue().equals(fieldVO.getFieldDataType())){
                sqlBuilder.append(" datetime ");
            }
            else if(TableFieldTypeEnum.NVarCharType.getValue().equals(fieldVO.getFieldDataType())){
                sqlBuilder.append(" nvarchar("+fieldVO.getFieldDataLength().toString()+")  ");
            }
            else if(TableFieldTypeEnum.TextType.getValue().equals(fieldVO.getFieldDataType())){
                sqlBuilder.append(" ntext ");
            }
            else {
                return BuilderResultMessage.getFieldTypeNodeSupportError(fieldVO.getFieldDataType());
            }

            if(TrueFalseEnum.True.getDisplayName().equals(fieldVO.getFieldIsPk())){
                sqlBuilder.append(" NOT NULL PRIMARY KEY");
            }
            else if(TrueFalseEnum.False.getDisplayName().equals(fieldVO.getFieldAllowNull())){
                sqlBuilder.append(" NOT NULL");
            }

            sqlBuilderService.execute(sqlBuilder.toString());
            return BuilderResultMessage.getSuccess();
        }
        catch (Exception ex){
            ex.printStackTrace();
            return BuilderResultMessage.getFieldCreateError(ex);
        }
    }

    public BuilderResultMessage deleteField(TableEntity tableEntity,TableFieldVO fieldVO){
        String dropTempFieldSQL="alter table "+tableEntity.getTableName()+" drop column "+fieldVO.getFieldName();
        sqlBuilderService.execute(dropTempFieldSQL);
        return BuilderResultMessage.getSuccess();
    }
}
