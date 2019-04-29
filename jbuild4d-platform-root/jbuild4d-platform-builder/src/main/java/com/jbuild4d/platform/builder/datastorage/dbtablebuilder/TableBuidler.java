package com.jbuild4d.platform.builder.datastorage.dbtablebuilder;

import com.jbuild4d.base.dbaccess.dbentities.builder.DbLinkEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableFieldEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.core.base.exception.JBuild4DPhysicalTableException;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.platform.builder.cliendatasource.ClientDataSourceManager;
import com.jbuild4d.platform.builder.vo.TableFieldVO;

import java.beans.PropertyVetoException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public abstract class TableBuidler {
    /*ISQLBuilderService sqlBuilderService;

    public ISQLBuilderService getSqlBuilderService() {
        return sqlBuilderService;
    }

    public void setSqlBuilderService(ISQLBuilderService sqlBuilderService) {
        this.sqlBuilderService = sqlBuilderService;
    }*/

    public boolean newTable(TableEntity tableEntity, List<TableFieldVO> fieldVos, TableGroupEntity tableGroupEntity, DbLinkEntity dbLinkEntity) throws JBuild4DPhysicalTableException, PropertyVetoException {
        try{
            if(fieldVos==null||fieldVos.size()==0){
                throw JBuild4DPhysicalTableException.getFieldsCannotBeNullError();
                //return BuilderResultMessage.getFieldsCannotBeNullError();
            }

            //判断是否已经存在同名的表
            if(isExistTable(tableEntity,dbLinkEntity)){
                //return BuilderResultMessage.getTableIsExistError(tableEntity.getTableName());
                throw JBuild4DPhysicalTableException.getTableIsExistError(tableEntity.getTableName());
            }

            //String TEMPFIELDZRB="TEMPFIELDZRB";
            try {
                String createTableSQL = buildCreateTableSQL(tableEntity);
                        //"CREATE TABLE " + tableEntity.getTableName() + "("+TEMPFIELDZRB+" VARCHAR(50) NULL)";//使用空的字段创建一个表

                //sqlBuilderService.execute(createTableSQL);

                ClientDataSourceManager clientDataSourceManager=new ClientDataSourceManager();
                clientDataSourceManager.execute(dbLinkEntity,createTableSQL);
            }
            catch (Exception ex){
                ex.printStackTrace();
                //return BuilderResultMessage.getCreateTableError(ex);
                throw JBuild4DPhysicalTableException.getCreateTableError(ex);
            }

            //在表中加入表字段
            for (TableFieldEntity fieldEntity : fieldVos) {
                boolean newField=newField(tableEntity,fieldEntity,tableGroupEntity, dbLinkEntity);
                if(!newField){
                    throw JBuild4DPhysicalTableException.getFieldCreateError();
                }
            }

            createTableEnd(tableEntity,dbLinkEntity);
            //删除掉用于建表是的临时字段
            //String dropTempFieldSQL="alter table "+tableEntity.getTableName()+" drop column "+TEMPFIELDZRB;
            //sqlBuilderService.execute(dropTempFieldSQL);

            return true;
        }
        catch (JBuild4DPhysicalTableException ex){
            //删除表
            ex.printStackTrace();
            deleteTable(tableEntity,dbLinkEntity);
            throw ex;
        }
        catch (Exception ex){
            ex.printStackTrace();
            deleteTable(tableEntity,dbLinkEntity);
            throw JBuild4DPhysicalTableException.getCreateTableError(ex);
        }
    }

    public boolean updateTable(TableEntity tableEntity,List<TableFieldVO> newFields,List<TableFieldVO> updateFields,List<TableFieldVO> deleteFields, TableGroupEntity tableGroupEntity, DbLinkEntity dbLinkEntity) throws JBuild4DPhysicalTableException {
        try{
            //判断是否存在表
            if(!isExistTable(tableEntity,dbLinkEntity)){
                throw JBuild4DPhysicalTableException.getTableIsNotExistError(tableEntity.getTableName());
            }

            //新增字段
            if(newFields!=null) {
                for (TableFieldEntity fieldEntity : newFields) {
                    this.newField(tableEntity, fieldEntity,tableGroupEntity,dbLinkEntity);
                }
            }

            //修改字段,暂时只是支持修改类型和名称
            if(updateFields!=null) {
                for (TableFieldVO updateField : updateFields) {
                    if(!updateField.isUpdateLogicOnly) {
                        /*if(this.recordCount(tableEntity)>10000){
                            throw JBuild4DPhysicalTableException.getUpdateFieldNoAllowOverCount(10000);
                        }*/
                        this.updateField(tableEntity, updateField,tableGroupEntity,dbLinkEntity);
                    }
                }
            }

            //删除字段
            if(deleteFields!=null) {
                for (TableFieldVO deleteField : deleteFields) {
                    deleteField(tableEntity, deleteField,tableGroupEntity,dbLinkEntity);
                }
            }

            return true;
        }
        catch (JBuild4DPhysicalTableException ex){
            ex.printStackTrace();
            throw ex;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw JBuild4DPhysicalTableException.getCreateTableError(ex);
        }
    }

    public boolean deleteTable(TableEntity tableEntity, DbLinkEntity dbLinkEntity) throws JBuild4DPhysicalTableException, PropertyVetoException {
        //DbLinkEntity dbLinkEntity=db
        //如果表中已经存在数据,提示需要先手工删除数据后,才能删除物理表.
        if(isExistRecord(tableEntity,dbLinkEntity)){
            //return BuilderResultMessage.getTableExistRecordError(tableEntity.getTableName());
            throw JBuild4DPhysicalTableException.getTableExistRecordError(tableEntity.getTableName());
        }
        String dropSQL=buildDeleteTableSQL(tableEntity);
                //"drop table "+tableEntity.getTableName();
        try{
            ClientDataSourceManager.execute(dbLinkEntity,dropSQL);
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw JBuild4DPhysicalTableException.getDeleteTableError(ex);
        }
        return true;
    }

    protected abstract String buildDeleteTableSQL(TableEntity tableEntity);

    protected abstract boolean deleteField(TableEntity tableEntity, TableFieldVO deleteField, TableGroupEntity tableGroupEntity, DbLinkEntity dbLinkEntity) throws PropertyVetoException;

    protected abstract boolean updateField(TableEntity tableEntity, TableFieldVO updateField, TableGroupEntity tableGroupEntity, DbLinkEntity dbLinkEntity) throws JBuild4DPhysicalTableException;

    protected abstract boolean newField(TableEntity tableEntity, TableFieldEntity fieldEntity, TableGroupEntity tableGroupEntity, DbLinkEntity dbLinkEntity) throws JBuild4DPhysicalTableException;

    protected abstract void createTableEnd(TableEntity tableEntity, DbLinkEntity dbLinkEntity) throws PropertyVetoException;

    protected abstract boolean isExistTable(TableEntity tableEntity, DbLinkEntity dbLinkEntity) throws PropertyVetoException;

    protected boolean isExistRecord(TableEntity tableEntity,DbLinkEntity dbLinkEntity) throws PropertyVetoException {
        String sql="select count(*) COUNT from "+tableEntity.getTableName();
        //Map result=sqlBuilderService.selectOne(sql,tableEntity.getTableName());
        Map result=ClientDataSourceManager.selectOne(dbLinkEntity,sql);
        if(Integer.parseInt(result.get("COUNT").toString())==0){
            return false;
        }
        return true;
    }

    protected int recordCount(TableEntity tableEntity,DbLinkEntity dbLinkEntity) throws PropertyVetoException {
        String sql="select count(*) COUNT from "+tableEntity.getTableName();
        //Map result=sqlBuilderService.selectOne(sql,tableEntity.getTableName());
        Map result=ClientDataSourceManager.selectOne(dbLinkEntity,sql);
        return Integer.parseInt(result.get("COUNT").toString());
    }

    protected abstract String buildCreateTableSQL(TableEntity tableEntity);
}
