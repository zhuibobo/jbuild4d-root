package com.jbuild4d.platform.builder.dataset.impl;

import com.jbuild4d.base.dbaccess.dao.builder.DatasetGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.dataset.IDatasetGroupService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
public class DatasetGroupServiceImpl extends BaseServiceImpl<DatasetGroupEntity> implements IDatasetGroupService
{
    private String rootId="0";
    private String rootParentId="-1";

    DatasetGroupMapper datasetGroupMapper;
    public DatasetGroupServiceImpl(DatasetGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        datasetGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, DatasetGroupEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DatasetGroupEntity>() {
            @Override
            public DatasetGroupEntity run(JB4DSession jb4DSession,DatasetGroupEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setDsGroupOrderNum(datasetGroupMapper.nextOrderNum());
                sourceEntity.setDsGroupChildCount(0);
                sourceEntity.setDsGroupCreateTime(new Date());
                sourceEntity.setDsGroupOrganId(jb4DSession.getOrganId());
                sourceEntity.setDsGroupOrganName(jb4DSession.getOrganName());
                String parentIdList;
                if(sourceEntity.getDsGroupId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setDsGroupParentId(rootParentId);
                }
                else
                {
                    DatasetGroupEntity parentEntity=datasetGroupMapper.selectByPrimaryKey(sourceEntity.getDsGroupParentId());
                    parentIdList=parentEntity.getDsGroupPidList();
                    parentEntity.setDsGroupChildCount(parentEntity.getDsGroupChildCount()+1);
                    datasetGroupMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setDsGroupPidList(parentIdList+"*"+sourceEntity.getDsGroupId());
                return sourceEntity;
            }
        });
    }

    @Override
    public DatasetGroupEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        DatasetGroupEntity rootEntity=new DatasetGroupEntity();
        rootEntity.setDsGroupId(rootId);
        rootEntity.setDsGroupParentId(rootParentId);
        rootEntity.setDsGroupIssystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setDsGroupText("数据集分组");
        rootEntity.setDsGroupValue("数据集分组");
        this.saveSimple(jb4DSession,rootEntity.getDsGroupId(),rootEntity);
        return rootEntity;
    }

    @Override
    public String getRootId() {
        return rootId;
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DatasetGroupEntity selfEntity=datasetGroupMapper.selectByPrimaryKey(id);
        DatasetGroupEntity ltEntity=datasetGroupMapper.selectLessThanRecord(id,selfEntity.getDsGroupParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DatasetGroupEntity selfEntity=datasetGroupMapper.selectByPrimaryKey(id);
        DatasetGroupEntity ltEntity=datasetGroupMapper.selectGreaterThanRecord(id,selfEntity.getDsGroupParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(DatasetGroupEntity toEntity,DatasetGroupEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getDsGroupOrderNum();
            toEntity.setDsGroupOrderNum(selfEntity.getDsGroupOrderNum());
            selfEntity.setDsGroupOrderNum(newNum);
            datasetGroupMapper.updateByPrimaryKeySelective(toEntity);
            datasetGroupMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
