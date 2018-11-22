package com.jbuild4d.platform.builder.datastorage.dbtablebuilder;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableFieldEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.exception.JBuild4DPhysicalTableException;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.vo.TableFieldVO;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public class MSSQLTableBuilder extends TableBuidler {

    String TEMPFIELDZRB="TEMPFIELDZRB";

    @Override
    protected boolean isExistTable(TableEntity tableEntity) {
        String sql="Select Name as TableName FROM SysObjects Where XType='U' and Name=#{name}";
        Map result=sqlBuilderService.selectOne(sql,tableEntity.getTableName());
        if(result==null||result.size()==0){
            return false;
        }
        return true;
    }

    @Override
    protected String buildCreateTableSQL(TableEntity tableEntity) {
        return "CREATE TABLE " + tableEntity.getTableName() + "("+TEMPFIELDZRB+" VARCHAR(50) NULL)";//使用空的字段创建一个表;
    }

    @Override
    protected void createTableEnd(TableEntity tableEntity) {
        String dropTempFieldSQL="alter table "+tableEntity.getTableName()+" drop column "+TEMPFIELDZRB;
        sqlBuilderService.execute(dropTempFieldSQL);
    }

    @Override
    protected String buildDeleteTableSQL(TableEntity tableEntity) {
        return "drop table "+tableEntity.getTableName();
    }

    private boolean appendFieldDataTypeTo(TableFieldEntity fieldEntity, StringBuilder sqlBuilder) throws JBuild4DPhysicalTableException {
        if (TableFieldTypeEnum.IntType.getValue().equals(fieldEntity.getFieldDataType())) {
            sqlBuilder.append(" int ");
        } else if (TableFieldTypeEnum.NumberType.getValue().equals(fieldEntity.getFieldDataType())) {
            sqlBuilder.append(" decimal(" + fieldEntity.getFieldDataLength().toString() + "," + fieldEntity.getFieldDecimalLength().toString() + ") ");
        } else if (TableFieldTypeEnum.DataTimeType.getValue().equals(fieldEntity.getFieldDataType())) {
            sqlBuilder.append(" datetime ");
        } else if (TableFieldTypeEnum.NVarCharType.getValue().equals(fieldEntity.getFieldDataType())) {
            sqlBuilder.append(" nvarchar(" + fieldEntity.getFieldDataLength().toString() + ")");
        } else if (TableFieldTypeEnum.TextType.getValue().equals(fieldEntity.getFieldDataType())) {
            sqlBuilder.append(" ntext ");
        } else {
            throw JBuild4DPhysicalTableException.getFieldTypeNodeSupportError(fieldEntity.getFieldDataType());
        }

        if (TrueFalseEnum.True.getDisplayName().equals(fieldEntity.getFieldIsPk())) {
            sqlBuilder.append(" NOT NULL PRIMARY KEY");
        } else if (TrueFalseEnum.False.getDisplayName().equals(fieldEntity.getFieldAllowNull())) {
            sqlBuilder.append(" NOT NULL");
        }
        return false;
    }

    @Override
    protected boolean newField(TableEntity tableEntity,TableFieldEntity fieldEntity) throws JBuild4DPhysicalTableException {
        try
        {
            StringBuilder sqlBuilder=new StringBuilder();
            sqlBuilder.append("alter table ");
            sqlBuilder.append(tableEntity.getTableName()+" add "+fieldEntity.getFieldName());
            appendFieldDataTypeTo(fieldEntity, sqlBuilder);
            sqlBuilderService.execute(sqlBuilder.toString());
            return true;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw JBuild4DPhysicalTableException.getFieldCreateError(ex);
        }
    }

    protected boolean updateField(TableEntity tableEntity,TableFieldVO fieldVO) throws JBuild4DPhysicalTableException {
        try
        {
            throw JBuild4DPhysicalTableException.getFieldUpdateError();
            /*StringBuilder sqlBuilder=new StringBuilder();
            sqlBuilder.append("alter table ");
            sqlBuilder.append(tableEntity.getTableName()+" alter column "+fieldVO.getFieldName());
            appendFieldDataTypeTo(fieldVO, sqlBuilder);
            sqlBuilderService.execute(sqlBuilder.toString());
            return true;*/
        }
        catch (Exception ex){
            ex.printStackTrace();
            //return BuilderResultMessage.getFieldCreateError(ex);
            throw JBuild4DPhysicalTableException.getFieldCreateError(ex);
        }
    }

    @Override
    public boolean deleteField(TableEntity tableEntity,TableFieldVO fieldVO){
        String dropTempFieldSQL="alter table "+tableEntity.getTableName()+" drop column "+fieldVO.getFieldName();
        sqlBuilderService.execute(dropTempFieldSQL);
        return true;
    }
}
