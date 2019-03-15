package com.jbuild4d.platform.builder.dataset.impl;

import com.jbuild4d.base.dbaccess.dao.builder.DatasetRelatedTableMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetRelatedTableEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.dataset.IDatasetRelatedTableService;
import com.jbuild4d.platform.builder.vo.DataSetRelatedTableVo;
import org.mybatis.spring.SqlSessionTemplate;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public class DatasetRelatedTableServiceImpl extends BaseServiceImpl<DatasetRelatedTableEntity> implements IDatasetRelatedTableService
{
    DatasetRelatedTableMapper datasetRelatedTableMapper;
    public DatasetRelatedTableServiceImpl(DatasetRelatedTableMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        datasetRelatedTableMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, DatasetRelatedTableEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DatasetRelatedTableEntity>() {
            @Override
            public DatasetRelatedTableEntity run(JB4DSession jb4DSession,DatasetRelatedTableEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public void deleteByDataSetId(JB4DSession jb4DSession, String dataSetId) {
        datasetRelatedTableMapper.deleteByDataSetId(dataSetId);
    }

    @Override
    public List<DataSetRelatedTableVo> getByDataSetId(JB4DSession jb4DSession, String dataSetId) throws IOException {
        List<DatasetRelatedTableEntity> datasetRelatedTableEntities=datasetRelatedTableMapper.selectByDataSetId(dataSetId);
        return DataSetRelatedTableVo.EntityListToVoList(datasetRelatedTableEntities);
    }
}

