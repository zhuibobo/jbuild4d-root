package com.jbuild4d.base.service.impl;

import com.jbuild4d.base.dbaccess.general.DBProp;
import com.jbuild4d.base.service.IMetadataService;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MetadataServiceImpl implements IMetadataService {

    ISQLBuilderService sqlBuilderService;

    public MetadataServiceImpl(ISQLBuilderService sqlBuilderService) {
        this.sqlBuilderService = sqlBuilderService;
    }

    @Override
    public String getTableComment(JB4DSession jb4DSession, String tableName) throws JBuild4DGenerallyException {
        String sql="";
        if(DBProp.isSqlServer()){
            //throw JBuild4DGenerallyException.getNotSupportMSSQLException();
            sql="SELECT " +
                    "convert(nvarchar(100), A.name) TABLE_NAME,"+
                    "convert(nvarchar(200), C.value) TABLE_COMMENT "+
                    "FROM sys.tables A " +
                    "inner JOIN sys.extended_properties C ON C.major_id = A.object_id  and minor_id=0 and A.name='"+tableName+"'";
        }
        else if(DBProp.isMySql()){
            sql="SELECT * FROM information_schema.tables WHERE table_schema = '"+DBProp.getDatabaseName()+"' and table_name=#{tableName}";
        }
        else if(DBProp.isOracle()){
            throw JBuild4DGenerallyException.getNotSupportOracleException();
        }
        Map<String, Object> tableInfo=sqlBuilderService.selectOne(sql,tableName);
        return tableInfo.get("TABLE_COMMENT").toString();
    }

    @Override
    public List<Map<String, Object>>  getTableFiledComment(String tableName) throws JBuild4DGenerallyException {
        String sql="";
        if(DBProp.isSqlServer()){
            sql="SELECT " +
                    "convert(nvarchar(100),A.name) AS TABLE_NAME," +
                    "convert(nvarchar(100),B.name) AS COLUMN_NAME," +
                    "convert(nvarchar(200),C.value) AS COLUMN_COMMENT " +
                    "FROM sys.tables A " +
                    "INNER JOIN sys.columns B ON B.object_id = A.object_id " +
                    "LEFT JOIN sys.extended_properties C ON C.major_id = B.object_id AND C.minor_id = B.column_id " +
                    "WHERE A.name = #{tableName}";
        }
        else if(DBProp.isMySql()){
            throw JBuild4DGenerallyException.getNotSupportMySQLException();
        }
        else if(DBProp.isOracle()){
            throw JBuild4DGenerallyException.getNotSupportOracleException();
        }
        List<Map<String, Object>> fieldsInfo=sqlBuilderService.selectList(sql,tableName);
        return fieldsInfo;
    }
}
