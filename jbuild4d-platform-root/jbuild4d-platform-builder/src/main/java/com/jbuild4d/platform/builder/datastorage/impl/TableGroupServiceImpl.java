package com.jbuild4d.platform.builder.datastorage.impl;

import com.jbuild4d.base.dbaccess.dao.builder.TableGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.datastorage.ITableGroupService;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.platform.builder.datastorage.ITableService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
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

    @Autowired
    ITableService tableService;

    @Override
    public String getRootId() {
        return rootId;
    }

    private String rootId="0";
    private String rootParentId="-1";

    private String TableGroupJBuild4DSystem="TableGroupJBuild4DSystem";
    private String TableGroupJBuild4DSystemSetting="TableGroupJBuild4DSystemSetting";
    private String TableGroupJBuild4DSystemSSORelevance ="TableGroupJBuild4DSystemSSORelevance";
    private String TableGroupJBuild4DSystemAuth="TableGroupJBuild4DSystemAuth";
    private String TableGroupJBuild4DSystemBuilder="TableGroupJBuild4DSystemBuilder";
    private String TableGroupJBuild4DSystemDevDemo="TableGroupJBuild4DSystemDevDemo";
    private String TableGroupJbuild4DFileStore="TableGroupJbuild4DFileStore";

    public TableGroupServiceImpl(TableGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, TableGroupEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TableGroupEntity>() {
            @Override
            public TableGroupEntity run(JB4DSession jb4DSession,TableGroupEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setTableGroupOrderNum(tableGroupMapper.nextOrderNum());
                sourceEntity.setTableGroupChildCount(0);
                sourceEntity.setTableGroupCreateTime(new Date());
                sourceEntity.setTableGroupOrganId(jb4DSession.getOrganId());
                sourceEntity.setTableGroupOrganName(jb4DSession.getOrganName());
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
        treeTableEntity.setTableGroupText("数据表分组");
        treeTableEntity.setTableGroupValue("数据表分组");
        this.saveSimple(jb4DSession,treeTableEntity.getTableGroupId(),treeTableEntity);
        return treeTableEntity;
    }

    @Override
    public TableGroupEntity createSystemTableGroupNode(JB4DSession jb4DSession,TableGroupEntity parentGroup) throws JBuild4DGenerallyException {
        //系统基础
        deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystem, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemBase=new TableGroupEntity();
        jBuild4DSystemBase.setTableGroupId(TableGroupJBuild4DSystem);
        jBuild4DSystemBase.setTableGroupParentId(parentGroup.getTableGroupId());
        jBuild4DSystemBase.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemBase.setTableGroupText("JBuild4D-System");
        jBuild4DSystemBase.setTableGroupValue("JBuild4D-System");
        this.saveSimple(jb4DSession,TableGroupJBuild4DSystem,jBuild4DSystemBase);

        //系统设置相关表
        deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystemSetting, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemSetting=new TableGroupEntity();
        jBuild4DSystemSetting.setTableGroupId(TableGroupJBuild4DSystemSetting);
        jBuild4DSystemSetting.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemSetting.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemSetting.setTableGroupText("系统设置相关表");
        jBuild4DSystemSetting.setTableGroupValue("系统设置相关表");
        this.saveSimple(jb4DSession,TableGroupJBuild4DSystemSetting,jBuild4DSystemSetting);

        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSYS_DICTIONARY_GROUP",jBuild4DSystemSetting);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSYS_DICTIONARY",jBuild4DSystemSetting);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSYS_JB4D_CACHE",jBuild4DSystemSetting);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSYS_MENU",jBuild4DSystemSetting);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSYS_OPERATION_LOG",jBuild4DSystemSetting);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSYS_SETTING",jBuild4DSystemSetting);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSYS_HISTORY_DATA",jBuild4DSystemSetting);

        //单点登录相关表
        deleteByKeyNotValidate(jb4DSession, TableGroupJBuild4DSystemSSORelevance, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity jBuild4DSSORelevance=new TableGroupEntity();
        jBuild4DSSORelevance.setTableGroupId(TableGroupJBuild4DSystemSSORelevance);
        jBuild4DSSORelevance.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSSORelevance.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSSORelevance.setTableGroupText("单点登录相关表");
        jBuild4DSSORelevance.setTableGroupValue("单点登录相关表");
        this.saveSimple(jb4DSession, TableGroupJBuild4DSystemSSORelevance,jBuild4DSSORelevance);

        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_ORGAN_TYPE",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_ORGAN",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_DEPARTMENT",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_DEPARTMENT_USER",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_USER",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_ROLE_GROUP",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_ROLE",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_USER_ROLE",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_AUTHORITY",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_SSO_APP",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_SSO_APP_INTERFACE",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_SSO_APP_FILE",jBuild4DSSORelevance);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TSSO_SSO_APP_USER_MAPPING",jBuild4DSSORelevance);

        //权限相关表
        /*deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystemAuth, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemAuth=new TableGroupEntity();
        jBuild4DSystemAuth.setTableGroupId(TableGroupJBuild4DSystemAuth);
        jBuild4DSystemAuth.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemAuth.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemAuth.setTableGroupText("权限相关表");
        jBuild4DSystemAuth.setTableGroupValue("权限相关表");
        this.saveSimple(jb4DSession,TableGroupJBuild4DSystemAuth,jBuild4DSystemAuth);*/

        //应用设计相关表
        deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystemBuilder, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemBuilder=new TableGroupEntity();
        jBuild4DSystemBuilder.setTableGroupId(TableGroupJBuild4DSystemBuilder);
        jBuild4DSystemBuilder.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemBuilder.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemBuilder.setTableGroupText("应用设计相关表");
        jBuild4DSystemBuilder.setTableGroupValue("应用设计相关表");
        this.saveSimple(jb4DSession,TableGroupJBuild4DSystemBuilder,jBuild4DSystemBuilder);

        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_SERVICE_LINK",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_TABLE_GROUP",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_TABLE",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_TABLE_FIELD",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_TABLE_RELATION_GROUP",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_TABLE_RELATION",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_TABLE_RELATION_HIS",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_DATASET_GROUP",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_DATASET",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_DATASET_COLUMN",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_DATASET_RELATED_TABLE",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_MODULE",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_FLOW_MODEL",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_FORM_CONFIG",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_FORM_RESOURCE",jBuild4DSystemBuilder);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TBUILD_LIST_RESOURCE",jBuild4DSystemBuilder);

        //文件存储相关表
        deleteByKeyNotValidate(jb4DSession,TableGroupJbuild4DFileStore, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity jbuild4DFileStore=new TableGroupEntity();
        jbuild4DFileStore.setTableGroupId(TableGroupJbuild4DFileStore);
        jbuild4DFileStore.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jbuild4DFileStore.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jbuild4DFileStore.setTableGroupText("文件存储相关表");
        jbuild4DFileStore.setTableGroupValue("文件存储相关表");
        this.saveSimple(jb4DSession,TableGroupJbuild4DFileStore,jbuild4DFileStore);

        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TFS_FILE_INFO",jbuild4DFileStore);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TFS_FILE_CONTENT",jbuild4DFileStore);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TFS_FILE_REF",jbuild4DFileStore);

        //开发示例相关表
        deleteByKeyNotValidate(jb4DSession,TableGroupJBuild4DSystemDevDemo, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity jBuild4DSystemDevDemo=new TableGroupEntity();
        jBuild4DSystemDevDemo.setTableGroupId(TableGroupJBuild4DSystemDevDemo);
        jBuild4DSystemDevDemo.setTableGroupParentId(jBuild4DSystemBase.getTableGroupId());
        jBuild4DSystemDevDemo.setTableGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemDevDemo.setTableGroupText("开发示例相关表");
        jBuild4DSystemDevDemo.setTableGroupValue("开发示例相关表");
        this.saveSimple(jb4DSession,TableGroupJBuild4DSystemDevDemo,jBuild4DSystemDevDemo);

        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TDEV_DEMO_GEN_LIST",jBuild4DSystemDevDemo);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TDEV_DEMO_TL_TREE",jBuild4DSystemDevDemo);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TDEV_DEMO_TL_TREE_LIST",jBuild4DSystemDevDemo);
        tableService.registerSystemTableToBuilderToModule(jb4DSession,"TDEV_DEMO_TREE_TABLE",jBuild4DSystemDevDemo);

        return jBuild4DSystemBase;
    }

    @Override
    public TableGroupEntity getByGroupText(JB4DSession jb4DSession, String groupText) {
        return tableGroupMapper.selectByGroupText(groupText);
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

