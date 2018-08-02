package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.TableGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.TableGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.service.ITableGroupService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public class TableGroupServiceImpl extends BaseServiceImpl<TableGroupEntity> implements ITableGroupService
{
    TableGroupMapper tableGroupMapper;

    private String rootId="0";
    private String rootParentId="-1";

    public TableGroupServiceImpl(TableGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, TableGroupEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TableGroupEntity>() {
            @Override
            public TableGroupEntity run(JB4DSession jb4DSession,TableGroupEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setTableGroupOrderNum(tableGroupMapper.nextOrderNum());
                sourceEntity.setTableGroupChildCount(0);
                sourceEntity.setTableGroupCreateTime(new Date());
                String parentIdList;
                if(sourceEntity.getTableGroupId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setTableGroupParentId(rootParentId);
                }
                else
                {
                    TableGroupEntity parentEntity=tableGroupMapper.selectByPrimaryKey(sourceEntity.getTableGroupParentId());
                    parentIdList=parentEntity.getTableGroupPidList();
                    parentEntity.setTableGroupChildCount(parentEntity.getTableGroupChildCount()+1);
                    tableGroupMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setTableGroupPidList(parentIdList+"*"+sourceEntity.getTableGroupId());
                return sourceEntity;
            }
        });
    }

    @Override
    public TableGroupEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        TableGroupEntity treeTableEntity=new TableGroupEntity();
        treeTableEntity.setTableGroupId("0");
        treeTableEntity.setTableGroupParentId(rootParentId);
        treeTableEntity.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        treeTableEntity.setTableGroupText("表分组");
        treeTableEntity.setTableGroupValue("表分组");
        this.save(jb4DSession,treeTableEntity.getTableGroupId(),treeTableEntity);
        return treeTableEntity;
    }
}

