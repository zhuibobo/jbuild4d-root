package com.jbuild4d.platform.builder.datasetbuilder;

import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.builder.vo.DataSetColumnVo;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.rowset.SqlRowSetMetaData;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public class SQLDataSetBuilder {

    JdbcOperations jdbcOperations;

    public JdbcOperations getJdbcOperations() {
        return jdbcOperations;
    }

    public void setJdbcOperations(JdbcOperations jdbcOperations) {
        this.jdbcOperations = jdbcOperations;
    }

    public DataSetVo resolveSQLToDataSet(JB4DSession jb4DSession, String sql){
        DataSetVo dataSetVo=new DataSetVo();
        List<DataSetColumnVo> dataSetColumnVoList=new ArrayList<>();
        jdbcOperations.execute(sql, new PreparedStatementCallback<Object>() {
            @Override
            public Object doInPreparedStatement(PreparedStatement ps) throws SQLException, DataAccessException {
                ResultSetMetaData resultSetMetaData=ps.getMetaData();
                for(int i=1;i<=resultSetMetaData.getColumnCount();i++){
                    //System.out.println(resultSetMetaData.getColumnName(i));
                }
                return null;
            }
        });
        dataSetVo.setColumnVoList(dataSetColumnVoList);
        return dataSetVo;
    }
}
