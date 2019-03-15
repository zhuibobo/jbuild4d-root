package com.jbuild4d.platform.sso.service.impl;
import java.util.Date;
import java.util.List;

import com.jbuild4d.base.dbaccess.dao.sso.RoleGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.RoleGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.IRoleGroupService;
import com.jbuild4d.platform.sso.service.IRoleService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

public class RoleGroupServiceImpl extends BaseServiceImpl<RoleGroupEntity> implements IRoleGroupService
{
    private String rootId="0";
    private String rootParentId="-1";

    @Autowired
    IRoleService roleService;

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
        this.deleteByKeyNotValidate(jb4DSession,rootId, JBuild4DProp.getWarningOperationCode());
        RoleGroupEntity rootEntity=new RoleGroupEntity();
        rootEntity.setRoleGroupId(rootId);
        rootEntity.setRoleGroupParentId(rootParentId);
        rootEntity.setRoleGroupIssystem(TrueFalseEnum.True.getDisplayName());
        rootEntity.setRoleGroupName("角色组分组");
        rootEntity.setRoleGroupDelEnable(TrueFalseEnum.False.getDisplayName());
        this.saveSimple(jb4DSession,rootEntity.getRoleGroupId(),rootEntity);
        rootEntity=roleGroupMapper.selectByPrimaryKey(rootId);
        rootEntity.setRoleGroupOrderNum(1);
        roleGroupMapper.updateByPrimaryKeySelective(rootEntity);
    }

    @Override
    public List<RoleGroupEntity> getALLOrderByAsc(JB4DSession session) {
        return roleGroupMapper.selectAllOrderByAsc();
    }

    @Override
    public int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        if(roleGroupMapper.countChildsRoleGroup(id)>0){
            throw new JBuild4DGenerallyException("该分组下存在子节点,请先删除子节点!");
        }
        if(roleService.countInRoleGroup(id)>0){
            throw new JBuild4DGenerallyException("该分组下存在角色,请先删除角色!");
        }
        return super.deleteByKey(jb4DSession, id);
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        RoleGroupEntity selfEntity=roleGroupMapper.selectByPrimaryKey(id);
        RoleGroupEntity ltEntity=roleGroupMapper.selectLessThanRecord(id,selfEntity.getRoleGroupParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        RoleGroupEntity selfEntity=roleGroupMapper.selectByPrimaryKey(id);
        RoleGroupEntity ltEntity=roleGroupMapper.selectGreaterThanRecord(id,selfEntity.getRoleGroupParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(RoleGroupEntity toEntity,RoleGroupEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getRoleGroupOrderNum();
            toEntity.setRoleGroupOrderNum(selfEntity.getRoleGroupOrderNum());
            selfEntity.setRoleGroupOrderNum(newNum);
            roleGroupMapper.updateByPrimaryKeySelective(toEntity);
            roleGroupMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}