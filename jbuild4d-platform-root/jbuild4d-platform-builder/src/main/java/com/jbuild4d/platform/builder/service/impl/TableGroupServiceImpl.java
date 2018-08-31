package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.builder.TableGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.service.ITableGroupService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;
import java.util.List;

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

    private String TableGroupJBuild4DSystem="TableGroupJBuild4DSystem";
    private String TableGroupJBuild4DSystemSetting="TableGroupJBuild4DSystemSetting";
    private String TableGroupJBuild4DSystemOrganRelevance="TableGroupJBuild4DSystemOrganRelevance";
    private String TableGroupJBuild4DSystemAuth="TableGroupJBuild4DSystemAuth";
    private String TableGroupJBuild4DSystemBuilder="TableGroupJBuild4DSystemBuilder";
    private String TableGroupJBuild4DSystemDevDemo="TableGroupJBuild4DSystemDevDemo";

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
        treeTableEntity.setTableGroupId(rootId);
        treeTableEntity.setTableGroupParentId(rootParentId);
        treeTableEntity.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        treeTableEntity.setTableGroupText("表分组");
        treeTableEntity.setTableGroupValue("表分组");
        this.save(jb4DSession,treeTableEntity.getTableGroupId(),treeTableEntity);
        return treeTableEntity;
    }

    @Override
    public TableGroupEntity createSystemTableGroupNode(JB4DSession jb4DSession,TableGroupEntity parentGroup) throws JBuild4DGenerallyException {
        //系统基础
        deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystem);
        TableGroupEntity jBuild4DSystemBase=new TableGroupEntity();
        jBuild4DSystemBase.setTableGroupId(TableGroupJBuild4DSystem);
        jBuild4DSystemBase.setTableGroupParentId(parentGroup.getTableGroupId());
        jBuild4DSystemBase.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemBase.setTableGroupText("基础系统");
        jBuild4DSystemBase.setTableGroupValue("基础系统");
        this.save(jb4DSession,TableGroupJBuild4DSystem,jBuild4DSystemBase);

        //系统设置相关表
        deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystemSetting);
        TableGroupEntity jBuild4DSystemSetting=new TableGroupEntity();
        jBuild4DSystemSetting.setTableGroupId(TableGroupJBuild4DSystemSetting);
        jBuild4DSystemSetting.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemSetting.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemSetting.setTableGroupText("系统设置相关表");
        jBuild4DSystemSetting.setTableGroupValue("系统设置相关表");
        this.save(jb4DSession,TableGroupJBuild4DSystemSetting,jBuild4DSystemSetting);

        //组织用户相关表
        deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystemOrganRelevance);
        TableGroupEntity jBuild4DSystemOrganRelevance=new TableGroupEntity();
        jBuild4DSystemOrganRelevance.setTableGroupId(TableGroupJBuild4DSystemOrganRelevance);
        jBuild4DSystemOrganRelevance.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemOrganRelevance.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemOrganRelevance.setTableGroupText("组织用户相关表");
        jBuild4DSystemOrganRelevance.setTableGroupValue("组织用户相关表");
        this.save(jb4DSession,TableGroupJBuild4DSystemOrganRelevance,jBuild4DSystemOrganRelevance);

        //权限相关表
        deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystemAuth);
        TableGroupEntity jBuild4DSystemAuth=new TableGroupEntity();
        jBuild4DSystemAuth.setTableGroupId(TableGroupJBuild4DSystemAuth);
        jBuild4DSystemAuth.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemAuth.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemAuth.setTableGroupText("权限相关表");
        jBuild4DSystemAuth.setTableGroupValue("权限相关表");
        this.save(jb4DSession,TableGroupJBuild4DSystemAuth,jBuild4DSystemAuth);

        //应用设计相关表
        deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystemBuilder);
        TableGroupEntity jBuild4DSystemBuilder=new TableGroupEntity();
        jBuild4DSystemBuilder.setTableGroupId(TableGroupJBuild4DSystemBuilder);
        jBuild4DSystemBuilder.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemBuilder.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemBuilder.setTableGroupText("应用设计相关表");
        jBuild4DSystemBuilder.setTableGroupValue("应用设计相关表");
        this.save(jb4DSession,TableGroupJBuild4DSystemBuilder,jBuild4DSystemBuilder);

        //开发示例相关表
        deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystemDevDemo);
        TableGroupEntity jBuild4DSystemDevDemo=new TableGroupEntity();
        jBuild4DSystemDevDemo.setTableGroupId(TableGroupJBuild4DSystemDevDemo);
        jBuild4DSystemDevDemo.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemDevDemo.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemDevDemo.setTableGroupText("开发示例相关表");
        jBuild4DSystemDevDemo.setTableGroupValue("开发示例相关表");
        this.save(jb4DSession,TableGroupJBuild4DSystemDevDemo,jBuild4DSystemDevDemo);

        return jBuild4DSystemBase;
    }

    @Override
    public TableGroupEntity getByGroupName(JB4DSession jb4DSession, String groupName) {
        return tableGroupMapper.selectByGroupName(groupName);
    }

    @Override
    public int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        TableGroupEntity tableGroupEntity=tableGroupMapper.selectByPrimaryKey(id);
        if(tableGroupEntity!=null){
            if(tableGroupEntity.getTableGroupIssystem().equals(TrueFalseEnum.True.getDisplayName())){
                throw JBuild4DGenerallyException.getSystemRecordDelException();
            }
            if(tableGroupEntity.getTableGroupDelEnable().equals(TrueFalseEnum.False.getDisplayName())){
                throw JBuild4DGenerallyException.getDBFieldSettingDelException();
            }
            List<TableGroupEntity> childEntityList=tableGroupMapper.selectChilds(id);
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

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        TableGroupEntity selfEntity=tableGroupMapper.selectByPrimaryKey(id);
        TableGroupEntity ltEntity=tableGroupMapper.selectLessThanRecord(id,selfEntity.getTableGroupParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        TableGroupEntity selfEntity=tableGroupMapper.selectByPrimaryKey(id);
        TableGroupEntity ltEntity=tableGroupMapper.selectGreaterThanRecord(id,selfEntity.getTableGroupParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(TableGroupEntity toEntity,TableGroupEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getTableGroupOrderNum();
            toEntity.setTableGroupOrderNum(selfEntity.getTableGroupOrderNum());
            selfEntity.setTableGroupOrderNum(newNum);
            tableGroupMapper.updateByPrimaryKeySelective(toEntity);
            tableGroupMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}

