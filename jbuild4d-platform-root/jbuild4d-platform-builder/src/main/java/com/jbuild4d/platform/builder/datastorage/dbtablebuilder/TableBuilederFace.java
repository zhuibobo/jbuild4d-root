package com.jbuild4d.platform.builder.datastorage.dbtablebuilder;

import com.jbuild4d.base.dbaccess.dbentities.builder.DbLinkEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.dbaccess.general.DBProp;
import com.jbuild4d.core.base.exception.JBuild4DPhysicalTableException;
import com.jbuild4d.core.base.exception.JBuild4DSQLKeyWordException;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.tools.SQLKeyWordUtility;
import com.jbuild4d.platform.builder.vo.TableFieldVO;

import java.beans.PropertyVetoException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public class TableBuilederFace {

    protected TableBuidler dbBuidler;

    private TableBuilederFace(){

    }

    public static TableBuilederFace getInstance(ISQLBuilderService sqlBuilderService) throws JBuild4DGenerallyException {
        TableBuilederFace instance=new TableBuilederFace();
        if(DBProp.isSqlServer()){
            instance.dbBuidler=new MSSQLTableBuilder();
            //instance.dbBuidler.setSqlBuilderService(sqlBuilderService);
        }
        else if(DBProp.isMySql()){
            instance.dbBuidler=new MYSQLTableBuilder();
            //instance.dbBuidler.setSqlBuilderService(sqlBuilderService);
            //throw new JBuild4DGenerallyException("暂不支持MYSQL");
        }
        else if(DBProp.isOracle()){
            throw new JBuild4DGenerallyException("暂不支持Oracle");
        }
        return instance;
    }

    private boolean validateTableEntity(TableEntity tableEntity) throws JBuild4DSQLKeyWordException {
        return SQLKeyWordUtility.singleWord(tableEntity.getTableName());
    }

    private boolean validateTableField(TableFieldVO fieldVo) throws JBuild4DSQLKeyWordException {
        return SQLKeyWordUtility.singleWord(fieldVo.getFieldName()) &&
                SQLKeyWordUtility.singleWord(fieldVo.getOldFieldName()) &&
                SQLKeyWordUtility.singleWord(fieldVo.getFieldDataType()) &&
                SQLKeyWordUtility.singleWord(fieldVo.getFieldAllowNull()) &&
                SQLKeyWordUtility.singleWord(fieldVo.getFieldIsPk());
    }

    private boolean validateTableFields(List<TableFieldVO> fieldVos) throws JBuild4DSQLKeyWordException {
        boolean result=true;
        for (TableFieldVO fieldVo : fieldVos) {
            validateTableField(fieldVo);
        }
        return result;
    }

    public boolean newTable(TableEntity tableEntity, List<TableFieldVO> fieldVos, TableGroupEntity tableGroupEntity, DbLinkEntity dbLinkEntity) throws JBuild4DSQLKeyWordException, JBuild4DPhysicalTableException, PropertyVetoException {
        this.validateTableEntity(tableEntity);
        this.validateTableFields(fieldVos);
        return dbBuidler.newTable(tableEntity,fieldVos,tableGroupEntity,dbLinkEntity);
    }

    public boolean isExistTable(String tableName, DbLinkEntity dbLinkEntity) throws PropertyVetoException {
        TableEntity tableEntity=new TableEntity();
        tableEntity.setTableName(tableName);
        return dbBuidler.isExistTable(tableEntity,dbLinkEntity);
    }

    public boolean updateTable(TableEntity tableEntity,List<TableFieldVO> newFields,List<TableFieldVO> updateFields,List<TableFieldVO> deleteFields, TableGroupEntity tableGroupEntity, DbLinkEntity dbLinkEntity) throws JBuild4DSQLKeyWordException, JBuild4DPhysicalTableException {
        this.validateTableEntity(tableEntity);
        this.validateTableFields(newFields);
        this.validateTableFields(updateFields);
        this.validateTableFields(deleteFields);
        return dbBuidler.updateTable(tableEntity,newFields,updateFields,deleteFields,tableGroupEntity,dbLinkEntity);
    }

    public boolean deleteTable(String tableName, DbLinkEntity dbLinkEntity) throws JBuild4DSQLKeyWordException, JBuild4DPhysicalTableException, PropertyVetoException {
        TableEntity tableEntity=new TableEntity();
        tableEntity.setTableName(tableName);
        return dbBuidler.deleteTable(tableEntity,dbLinkEntity);
    }

    public boolean deleteTable(TableEntity tableEntity, DbLinkEntity dbLinkEntity) throws JBuild4DSQLKeyWordException, JBuild4DPhysicalTableException, PropertyVetoException {
        this.validateTableEntity(tableEntity);
        return dbBuidler.deleteTable(tableEntity,dbLinkEntity);
    }

    public int recordCount(TableEntity oldTableEntity, DbLinkEntity dbLinkEntity) throws PropertyVetoException {
        return dbBuidler.recordCount(oldTableEntity,dbLinkEntity);
    }
}
