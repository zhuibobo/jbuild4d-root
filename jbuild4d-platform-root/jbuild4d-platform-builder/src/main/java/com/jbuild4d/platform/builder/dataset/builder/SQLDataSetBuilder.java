package com.jbuild4d.platform.builder.dataset.builder;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.vo.DataSetColumnVo;
import com.jbuild4d.platform.builder.vo.DataSetRelatedTableVo;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.expression.BinaryExpression;
import net.sf.jsqlparser.expression.Expression;
import net.sf.jsqlparser.parser.CCJSqlParserManager;
import net.sf.jsqlparser.schema.Column;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.select.Select;
import net.sf.jsqlparser.util.TablesNamesFinder;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcOperations;
import org.springframework.jdbc.core.PreparedStatementCallback;

import java.io.StringReader;
import java.sql.PreparedStatement;
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
        List<DataSetRelatedTableVo> dataSetRelatedTableVoList=new ArrayList<>();

        CCJSqlParserManager pm = new CCJSqlParserManager();
        Statement statement = null;
        try {
            statement = pm.parse(new StringReader(sql));
        } catch (JSQLParserException e) {
            e.printStackTrace();
        }

        if (statement instanceof Select) {

            //解析相关的表
            //获得Select对象
            Select selectStatement = (Select) statement;
            TablesNamesFinder tablesNamesFinder = new TablesNamesFinder();
            List tableList = tablesNamesFinder.getTableList(selectStatement);
            for (Object o : tableList) {
                DataSetRelatedTableVo dataSetRelatedTableVo=new DataSetRelatedTableVo();
                dataSetRelatedTableVo.setRtTableName(o.toString());
                dataSetRelatedTableVoList.add(dataSetRelatedTableVo);
            }

            //解析相关的字段
            jdbcOperations.execute(sql, new PreparedStatementCallback<Object>() {
                @Override
                public Object doInPreparedStatement(PreparedStatement ps) throws SQLException, DataAccessException {
                    ResultSetMetaData resultSetMetaData=ps.getMetaData();
                    for(int i=1;i<=resultSetMetaData.getColumnCount();i++){
                        DataSetColumnVo columnVo=new DataSetColumnVo();
                        columnVo.setColumnName(resultSetMetaData.getColumnName(i));
                        dataSetColumnVoList.add(columnVo);
                        //System.out.println(resultSetMetaData.getColumnName(i));
                        //System.out.println(resultSetMetaData.getTableName(i));
                    }
                    return null;
                }
            });

            dataSetVo.setRelatedTableVoList(dataSetRelatedTableVoList);
            dataSetVo.setColumnVoList(dataSetColumnVoList);
        }

        return dataSetVo;
    }

    /**
     * 获得where条件字段中列名，以及对应的操作符
     * @Title: getColumnName
     * @Description: TODO(这里用一句话描述这个方法的作用)
     * @param @param expression
     * @param @param allColumnNames
     * @param @return 设定文件
     * @return StringBuffer 返回类型
     * @throws
     */
    private static StringBuffer getColumnName(Expression expression,StringBuffer allColumnNames) {

        String columnName = null;
        if(expression instanceof BinaryExpression){
            //获得左边表达式
            Expression leftExpression = ((BinaryExpression) expression).getLeftExpression();
            //如果左边表达式为Column对象，则直接获得列名
            if(leftExpression  instanceof Column){
                //获得列名
                columnName = ((Column) leftExpression).getColumnName();
                allColumnNames.append(columnName);
                allColumnNames.append(":");
                //拼接操作符
                allColumnNames.append(((BinaryExpression) expression).getStringExpression());
                //allColumnNames.append("-");
            }
            //否则，进行迭代
            else if(leftExpression instanceof BinaryExpression){
                getColumnName((BinaryExpression)leftExpression,allColumnNames);
            }

            //获得右边表达式，并分解
            Expression rightExpression = ((BinaryExpression) expression).getRightExpression();
            if(rightExpression instanceof BinaryExpression){
                Expression leftExpression2 = ((BinaryExpression) rightExpression).getLeftExpression();
                if(leftExpression2 instanceof Column){
                    //获得列名
                    columnName = ((Column) leftExpression2).getColumnName();
                    allColumnNames.append("-");
                    allColumnNames.append(columnName);
                    allColumnNames.append(":");
                    //获得操作符
                    allColumnNames.append(((BinaryExpression) rightExpression).getStringExpression());
                }
            }
        }
        return allColumnNames;
    }
}
