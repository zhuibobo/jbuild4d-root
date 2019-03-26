package com.jbuild4d.platform.builder.datastorage.impl;

import com.jbuild4d.base.dbaccess.dao.builder.TableRelationGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.datastorage.ITableRelationGroupService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;
import java.util.List;

public class TableRelationGroupServiceImpl extends BaseServiceImpl<TableRelationGroupEntity> implements ITableRelationGroupService
{
    @Override
    public String getRootId() {
        return rootId;
    }

    private String rootId="0";
    private String rootParentId="-1";

    TableRelationGroupMapper tableRelationGroupMapper;

    public TableRelationGroupServiceImpl(TableRelationGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableRelationGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, TableRelationGroupEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TableRelationGroupEntity>() {
            @Override
            public TableRelationGroupEntity run(JB4DSession jb4DSession,TableRelationGroupEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setRelGroupOrderNum(tableRelationGroupMapper.nextOrderNum());
                sourceEntity.setRelGroupChildCount(0);
                sourceEntity.setRelGroupCreateTime(new Date());
                sourceEntity.setRelGroupUserId(jb4DSession.getUserId());
                sourceEntity.setRelGroupUserName(jb4DSession.getUserName());
                String parentIdList;
                if(sourceEntity.getRelGroupId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setRelGroupParentId(rootParentId);
                }
                else
                {
                    TableRelationGroupEntity parentEntity=tableRelationGroupMapper.selectByPrimaryKey(sourceEntity.getRelGroupParentId());
                    parentIdList=parentEntity.getRelGroupPidList();
                    parentEntity.setRelGroupChildCount(parentEntity.getRelGroupChildCount()+1);
                    tableRelationGroupMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setRelGroupPidList(parentIdList+"*"+sourceEntity.getRelGroupId());
                return sourceEntity;
            }
        });
    }

    @Override
    public TableRelationGroupEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        TableRelationGroupEntity treeTableEntity=new TableRelationGroupEntity();
        treeTableEntity.setRelGroupId(rootId);
        treeTableEntity.setRelGroupParentId(rootParentId);
        treeTableEntity.setRelGroupIssystem(TrueFalseEnum.True.getDisplayName());
        treeTableEntity.setRelGroupText("表关系分组");
        treeTableEntity.setRelGroupValue("表关系分组");
        this.saveSimple(jb4DSession,treeTableEntity.getRelGroupId(),treeTableEntity);
        return treeTableEntity;
    }

    @Override
    public int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        TableRelationGroupEntity groupEntity=tableRelationGroupMapper.selectByPrimaryKey(id);
        if(groupEntity!=null){
            if(groupEntity.getRelGroupIssystem().equals(TrueFalseEnum.True.getDisplayName())){
                throw JBuild4DGenerallyException.getSystemRecordDelException();
            }
            if(groupEntity.getRelGroupDelEnable().equals(TrueFalseEnum.False.getDisplayName())){
                throw JBuild4DGenerallyException.getDBFieldSettingDelException();
            }
            List<TableRelationGroupEntity> childEntityList=tableRelationGroupMapper.selectChilds(id);
            if(childEntityList!=null&&childEntityList.size()>0){
                throw JBuild4DGenerallyException.getHadChildDelException();
            }
            return super.deleteByKey(jb4DSession, id);
        }
        else
        {
            throw new JBuild4DGenerallyException("找不到要删除的记录!");
        }
    }
}