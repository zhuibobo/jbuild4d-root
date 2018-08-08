package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.DatasetMapper;
import com.jbuild4d.base.dbaccess.dbentities.DatasetEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.datasetbuilder.SQLDataSetBuilder;
import com.jbuild4d.platform.builder.service.IDatasetService;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import org.apache.ibatis.session.ResultContext;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.jdbc.core.JdbcOperations;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public class DatasetServiceImpl extends BaseServiceImpl<DatasetEntity> implements IDatasetService
{
    DatasetMapper datasetMapper;
    JdbcOperations jdbcOperations;

    public DatasetServiceImpl(DatasetMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService,JdbcOperations _jdbcOperations){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        datasetMapper=_defaultBaseMapper;
        jdbcOperations=_jdbcOperations;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DatasetEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DatasetEntity>() {
            @Override
            public DatasetEntity run(JB4DSession jb4DSession,DatasetEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public DataSetVo resolveSQLToDataSet(JB4DSession jb4DSession,String sql){
        SQLDataSetBuilder sqlDataSetBuilder=new SQLDataSetBuilder();
        sqlDataSetBuilder.setJdbcOperations(jdbcOperations);
        return sqlDataSetBuilder.resolveSQLToDataSet(jb4DSession,sql);
    }
}

