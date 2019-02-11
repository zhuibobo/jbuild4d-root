package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.builder.ModuleMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.ModuleEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.service.IModuleService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

public class ModuleServiceImpl extends BaseServiceImpl<ModuleEntity> implements IModuleService
{
    private String rootId="0";
    private String rootParentId="-1";

    ModuleMapper moduleMapper;
    public ModuleServiceImpl(ModuleMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        moduleMapper=_defaultBaseMapper;
    }

    @Override
    public ModuleEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        ModuleEntity rootEntity=new ModuleEntity();
        rootEntity.setModuleId(rootId);
        rootEntity.setModuleParentId(rootParentId);
        rootEntity.setModuleIssystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setModuleText("模块分组");
        rootEntity.setModuleValue("模块分组");
        this.save(jb4DSession,rootEntity.getModuleId(),rootEntity);
        return rootEntity;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, ModuleEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<ModuleEntity>() {
            @Override
            public ModuleEntity run(JB4DSession jb4DSession,ModuleEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setModuleOrderNum(moduleMapper.nextOrderNum());
                sourceEntity.setModuleChildCount(0);
                sourceEntity.setModuleCreateTime(new Date());
                sourceEntity.setModuleOrganId(jb4DSession.getOrganId());
                sourceEntity.setModuleOrganName(jb4DSession.getOrganName());
                String parentIdList;
                if(sourceEntity.getModuleId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setModuleParentId(rootParentId);
                }
                else
                {
                    ModuleEntity parentEntity=moduleMapper.selectByPrimaryKey(sourceEntity.getModuleParentId());
                    parentIdList=parentEntity.getModulePidList();
                    parentEntity.setModuleChildCount(parentEntity.getModuleChildCount()+1);
                    moduleMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setModulePidList(parentIdList+"*"+sourceEntity.getModuleId());
                return sourceEntity;
            }
        });
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        ModuleEntity selfEntity=moduleMapper.selectByPrimaryKey(id);
        ModuleEntity ltEntity=moduleMapper.selectLessThanRecord(id,selfEntity.getModuleParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        ModuleEntity selfEntity=moduleMapper.selectByPrimaryKey(id);
        ModuleEntity ltEntity=moduleMapper.selectGreaterThanRecord(id,selfEntity.getModuleParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(ModuleEntity toEntity,ModuleEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getModuleOrderNum();
            toEntity.setModuleOrderNum(selfEntity.getModuleOrderNum());
            selfEntity.setModuleOrderNum(newNum);
            moduleMapper.updateByPrimaryKeySelective(toEntity);
            moduleMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }

    @Override
    public String buildModuleItemCode(int num){
        return String.format("1%05d", num);
    }
}

