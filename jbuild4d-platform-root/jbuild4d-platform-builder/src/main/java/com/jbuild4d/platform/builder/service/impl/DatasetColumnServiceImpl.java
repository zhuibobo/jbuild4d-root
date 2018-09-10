package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.builder.DatasetColumnMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetColumnEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.service.IDatasetColumnService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public class DatasetColumnServiceImpl extends BaseServiceImpl<DatasetColumnEntity> implements IDatasetColumnService
{
    DatasetColumnMapper datasetColumnMapper;
    public DatasetColumnServiceImpl(DatasetColumnMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        datasetColumnMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DatasetColumnEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DatasetColumnEntity>() {
            @Override
            public DatasetColumnEntity run(JB4DSession jb4DSession,DatasetColumnEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public void deleteByDataSetId(JB4DSession jb4DSession, String dataSetId) {
        datasetColumnMapper.deleteByDataSetId(dataSetId);
    }
}
