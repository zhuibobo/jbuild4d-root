package com.jbuild4d.platform.builder.cliendatasource;

import com.jbuild4d.base.dbaccess.dbentities.builder.DbLinkEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.dbaccess.general.DBProp;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.jdbc.core.RowMapper;

import java.beans.PropertyVetoException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class ClientDataSourceManager {
    public static JdbcTemplate getJdbcTemplate(DbLinkEntity dbLinkEntity) throws PropertyVetoException {
        ComboPooledDataSource comboPooledDataSource=new ComboPooledDataSource();

        if(dbLinkEntity.getDbIsLocation().equals(TrueFalseEnum.True.getDisplayName())){
            dbLinkEntity.setDbDriverName(DBProp.getDriverName());
            dbLinkEntity.setDbDatabaseName(DBProp.getDatabaseName());
            dbLinkEntity.setDbUser(DBProp.getUser());
            dbLinkEntity.setDbPassword(DBProp.getPassword());
            dbLinkEntity.setDbUrl(DBProp.getUrl());
        }

        comboPooledDataSource.setDriverClass(dbLinkEntity.getDbDriverName());
        comboPooledDataSource.setJdbcUrl(dbLinkEntity.getDbUrl());
        comboPooledDataSource.setUser(dbLinkEntity.getDbUser());
        comboPooledDataSource.setPassword(dbLinkEntity.getDbPassword());
        JdbcTemplate jdbcTemplate=new JdbcTemplate(comboPooledDataSource);
        return jdbcTemplate;
    }

    public static void execute(DbLinkEntity dbLinkEntity,String sql) throws PropertyVetoException {
        JdbcTemplate jdbcTemplate=getJdbcTemplate(dbLinkEntity);
        jdbcTemplate.execute(sql);
    }

    public static void execute(DbLinkEntity dbLinkEntity, String sql, PreparedStatementCallback preparedStatementCallback) throws PropertyVetoException {
        JdbcTemplate jdbcTemplate=getJdbcTemplate(dbLinkEntity);
        jdbcTemplate.execute(sql,preparedStatementCallback);
    }

    public static Map selectOne(DbLinkEntity dbLinkEntity,String sql) throws PropertyVetoException {
        JdbcTemplate jdbcTemplate=getJdbcTemplate(dbLinkEntity);
        //jdbcTemplate.
        List<Object> strLst=jdbcTemplate.query(sql, new RowMapper<Object>() {
            @Override
            public Object mapRow(ResultSet resultSet, int i) throws SQLException {
                return 1;
            }
        });
        if(strLst.isEmpty()){
            return null;
        }
        return jdbcTemplate.queryForMap(sql);
    }
}
