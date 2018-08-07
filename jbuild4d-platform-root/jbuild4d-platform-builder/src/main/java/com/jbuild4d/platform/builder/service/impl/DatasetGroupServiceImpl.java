package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.DatasetGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.DatasetGroupEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.service.IDatasetGroupService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public class DatasetGroupServiceImpl extends BaseServiceImpl<DatasetGroupEntity> implements IDatasetGroupService
{
    DatasetGroupMapper datasetGroupMapper;
    public DatasetGroupServiceImpl(DatasetGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        datasetGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DatasetGroupEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DatasetGroupEntity>() {
            @Override
            public DatasetGroupEntity run(JB4DSession jb4DSession,DatasetGroupEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }
}
