package com.jbuild4d.platform.sso.service.impl;
import java.util.Date;

import com.jbuild4d.base.dbaccess.dao.sso.RoleGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.RoleGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.IRoleGroupService;
import org.mybatis.spring.SqlSessionTemplate;

public class RoleGroupServiceImpl extends BaseServiceImpl<RoleGroupEntity> implements IRoleGroupService
{
    private String rootId="0";
    private String rootParentId="-1";

    RoleGroupMapper roleGroupMapper;
    public RoleGroupServiceImpl(RoleGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        roleGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, RoleGroupEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<RoleGroupEntity>() {
            @Override
            public RoleGroupEntity run(JB4DSession jb4DSession,RoleGroupEntity sourceEntity) throws JBuild4DGenerallyException {

                sourceEntity.setRoleGroupOrderNum(roleGroupMapper.nextOrderNum());
                sourceEntity.setRoleGroupCreateTime(new Date());
                sourceEntity.setRoleGroupPidList("");
                sourceEntity.setRoleGroupChildCount(0);

                String parentIdList;
                if(sourceEntity.getRoleGroupId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setRoleGroupPidList(rootParentId);
                }
                else
                {
                    RoleGroupEntity parentEntity=roleGroupMapper.selectByPrimaryKey(sourceEntity.getRoleGroupParentId());
                    parentIdList=parentEntity.getRoleGroupPidList();
                    parentEntity.setRoleGroupChildCount(parentEntity.getRoleGroupChildCount()+1);
                    roleGroupMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setRoleGroupPidList(parentIdList+"*"+sourceEntity.getRoleGroupId());

                sourceEntity.setRoleGroupCreaterId(jb4DSession.getUserId());
                sourceEntity.setRoleGroupOrganId(jb4DSession.getOrganId());

                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public void initSystemData(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        RoleGroupEntity rootEntity=new RoleGroupEntity();
        rootEntity.setRoleGroupId(rootId);
        rootEntity.setRoleGroupParentId(rootParentId);
        rootEntity.setRoleGroupIssystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setRoleGroupName("数据集分组");
        rootEntity.setRoleGroupDelEnable(TrueFalseEnum.False.getDisplayName());
        this.saveSimple(jb4DSession,rootEntity.getRoleGroupId(),rootEntity);
    }
}