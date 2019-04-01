package com.jbuild4d.platform.builder.datastorage.impl;

import com.jbuild4d.base.dbaccess.dao.builder.TableRelationGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntityWithBLOBs;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationGroupEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.datastorage.ITableRelationGroupService;
import com.jbuild4d.platform.builder.datastorage.ITableRelationService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

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

    @Autowired
    ITableRelationService tableRelationService;

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

    @Override
    public TableRelationGroupEntity createSystemTableRelationGroupNode(JB4DSession jb4DSession, TableRelationGroupEntity parentGroup) throws JBuild4DGenerallyException{
        String TableRelationGroupJBuild4DSystem="TableRelationGroupJBuild4DSystem";
        String TableRelationGroupJBuild4DSystemSetting="TableRelationGroupJBuild4DSystemSetting";
        String TableRelationGroupJBuild4DSystemSSORelevance ="TableRelationGroupJBuild4DSystemSSORelevance";
        String TableRelationGroupJBuild4DSystemBuilder="TableRelationGroupJBuild4DSystemBuilder";
        String TableRelationGroupJBuild4DSystemDevDemo="TableRelationGroupJBuild4DSystemDevDemo";
        String TableRelationGroupJbuild4DFileStore="TableRelationGroupJbuild4DFileStore";

        //系统基础
        deleteByKeyNotValidate(jb4DSession,TableRelationGroupJBuild4DSystem, JBuild4DProp.getWarningOperationCode());
        TableRelationGroupEntity jBuild4DSystemBaseEntity=new TableRelationGroupEntity();
        jBuild4DSystemBaseEntity.setRelGroupId(TableRelationGroupJBuild4DSystem);
        jBuild4DSystemBaseEntity.setRelGroupParentId(parentGroup.getRelGroupId());
        jBuild4DSystemBaseEntity.setRelGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemBaseEntity.setRelGroupText("JBuild4D-System-Relation");
        jBuild4DSystemBaseEntity.setRelGroupValue("JBuild4D-System-Relation");
        this.saveSimple(jb4DSession,TableRelationGroupJBuild4DSystem,jBuild4DSystemBaseEntity);

        //系统设置相关表
        deleteByKeyNotValidate(jb4DSession,TableRelationGroupJBuild4DSystemSetting, JBuild4DProp.getWarningOperationCode());
        TableRelationGroupEntity jBuild4DSystemSetting=new TableRelationGroupEntity();
        jBuild4DSystemSetting.setRelGroupId(TableRelationGroupJBuild4DSystemSetting);
        jBuild4DSystemSetting.setRelGroupParentId(jBuild4DSystemBaseEntity.getRelGroupId());
        jBuild4DSystemSetting.setRelGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemSetting.setRelGroupText("系统设置相关表关系");
        jBuild4DSystemSetting.setRelGroupValue("系统设置相关表关系");
        this.saveSimple(jb4DSession,TableRelationGroupJBuild4DSystemSetting,jBuild4DSystemSetting);

        this.createTableRelation(jb4DSession,jBuild4DSystemSetting,"TSYS_DICTIONARY_RELATION","数据字典关系图","数据字典分组与数据字典的关系图","{\n" +
                "  \"tableList\": [\n" +
                "    {\n" +
                "      \"tableId\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y\",\n" +
                "      \"loc\": \"129 -91\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"tableId\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y___G_R_O_U_P\",\n" +
                "      \"loc\": \"-722 -69\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"lineList\": [\n" +
                "    {\n" +
                "      \"lineId\": \"86c490ac-068e-0db0-893b-62817463bcac\",\n" +
                "      \"from\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y\",\n" +
                "      \"to\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y\",\n" +
                "      \"fromText\": \"DICT_PARENT_ID[1]\",\n" +
                "      \"toText\": \"DICT_ID[1]\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"lineId\": \"030ab739-f5f6-6e8b-581f-afaa9f024688\",\n" +
                "      \"from\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y___G_R_O_U_P\",\n" +
                "      \"to\": \"T_S_Y_S___D_I_C_T_I_O_N_A_R_Y\",\n" +
                "      \"fromText\": \"DICT_GROUP_ID[1]\",\n" +
                "      \"toText\": \"DICT_GROUP_ID[0..N]\"\n" +
                "    }\n" +
                "  ]\n" +
                "}","");

        //单点登录相关表
        deleteByKeyNotValidate(jb4DSession, TableRelationGroupJBuild4DSystemSSORelevance, JBuild4DProp.getWarningOperationCode());
        TableRelationGroupEntity jBuild4DSSORelevance=new TableRelationGroupEntity();
        jBuild4DSSORelevance.setRelGroupId(TableRelationGroupJBuild4DSystemSSORelevance);
        jBuild4DSSORelevance.setRelGroupParentId(jBuild4DSystemBaseEntity.getRelGroupId());
        jBuild4DSSORelevance.setRelGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSSORelevance.setRelGroupText("单点登录相关表关系");
        jBuild4DSSORelevance.setRelGroupValue("单点登录相关表关系");
        this.saveSimple(jb4DSession, TableRelationGroupJBuild4DSystemSSORelevance,jBuild4DSSORelevance);

        this.createTableRelation(jb4DSession,jBuild4DSSORelevance,"TSSO_ORGAN_DEPT_USER","机构部门人员关系图","机构部门人员关系图的关系图","","");

        //应用设计相关表
        deleteByKeyNotValidate(jb4DSession,TableRelationGroupJBuild4DSystemBuilder, JBuild4DProp.getWarningOperationCode());
        TableRelationGroupEntity jBuild4DSystemBuilder=new TableRelationGroupEntity();
        jBuild4DSystemBuilder.setRelGroupId(TableRelationGroupJBuild4DSystemBuilder);
        jBuild4DSystemBuilder.setRelGroupParentId(jBuild4DSystemBaseEntity.getRelGroupId());
        jBuild4DSystemBuilder.setRelGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemBuilder.setRelGroupText("应用设计相关表关系");
        jBuild4DSystemBuilder.setRelGroupValue("应用设计相关表关系");
        this.saveSimple(jb4DSession,TableRelationGroupJBuild4DSystemBuilder,jBuild4DSystemBuilder);


        //文件存储相关表
        deleteByKeyNotValidate(jb4DSession,TableRelationGroupJbuild4DFileStore, JBuild4DProp.getWarningOperationCode());
        TableRelationGroupEntity jbuild4DFileStore=new TableRelationGroupEntity();
        jbuild4DFileStore.setRelGroupId(TableRelationGroupJbuild4DFileStore);
        jbuild4DFileStore.setRelGroupParentId(jBuild4DSystemBaseEntity.getRelGroupId());
        jbuild4DFileStore.setRelGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jbuild4DFileStore.setRelGroupText("文件存储相关表关系");
        jbuild4DFileStore.setRelGroupValue("文件存储相关表表关系");
        this.saveSimple(jb4DSession,TableRelationGroupJbuild4DFileStore,jbuild4DFileStore);

        //开发示例相关表
        deleteByKeyNotValidate(jb4DSession,TableRelationGroupJBuild4DSystemDevDemo, JBuild4DProp.getWarningOperationCode());
        TableRelationGroupEntity jBuild4DSystemDevDemo=new TableRelationGroupEntity();
        jBuild4DSystemDevDemo.setRelGroupId(TableRelationGroupJBuild4DSystemDevDemo);
        jBuild4DSystemDevDemo.setRelGroupParentId(jBuild4DSystemBaseEntity.getRelGroupId());
        jBuild4DSystemDevDemo.setRelGroupIssystem(TrueFalseEnum.True.getDisplayName());
        jBuild4DSystemDevDemo.setRelGroupText("开发示例相关表关系");
        jBuild4DSystemDevDemo.setRelGroupValue("开发示例相关表关系");
        this.saveSimple(jb4DSession,TableRelationGroupJBuild4DSystemDevDemo,jBuild4DSystemDevDemo);

        return jBuild4DSystemBaseEntity;
    }

    private void createTableRelation(JB4DSession jb4DSession,TableRelationGroupEntity tableGroup,String tableRelationId,String tableRelationName,String tableRelationDesc,String contentJson,String diagramJson) throws JBuild4DGenerallyException {
        tableRelationService.deleteByKeyNotValidate(jb4DSession,tableRelationId,JBuild4DProp.getWarningOperationCode());
        TableRelationEntityWithBLOBs tableRelationEntity=new TableRelationEntityWithBLOBs();
        tableRelationEntity.setRelationId(tableRelationId);
        tableRelationEntity.setRelationGroupId(tableGroup.getRelGroupId());
        tableRelationEntity.setRelationName(tableRelationName);
        tableRelationEntity.setRelationDesc(tableRelationDesc);
        tableRelationEntity.setRelationStatus(EnableTypeEnum.enable.getDisplayName());
        tableRelationEntity.setRelationContent(contentJson);
        tableRelationEntity.setRelationDiagramJson(diagramJson);

        tableRelationService.saveSimple(jb4DSession,tableRelationId,tableRelationEntity);
    }
}