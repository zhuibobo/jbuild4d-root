package com.jbuild4d.platform.sso.service.impl;
import java.util.Date;

import com.jbuild4d.base.dbaccess.dao.sso.RoleMapper;
import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoGenListEntity;
import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTLTreeListEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.RoleEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.sso.service.IRoleService;
import org.mybatis.spring.SqlSessionTemplate;

public class RoleServiceImpl extends BaseServiceImpl<RoleEntity> implements IRoleService
{
    RoleMapper roleMapper;
    public RoleServiceImpl(RoleMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        roleMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, RoleEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<RoleEntity>() {
            @Override
            public RoleEntity run(JB4DSession jb4DSession,RoleEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setRoleOrderNum(roleMapper.nextOrderNum());
                sourceEntity.setRoleCreateTime(new Date());
                sourceEntity.setRoleCreaterId(jb4DSession.getUserId());
                sourceEntity.setRoleOrganId(jb4DSession.getOrganId());
                return sourceEntity;
            }
        });
    }

    @Override
    public int countInRoleGroup(String groupId) {
        return roleMapper.countInRoleGroup(groupId);
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        RoleEntity selfEntity=roleMapper.selectByPrimaryKey(id);
        RoleEntity ltEntity=roleMapper.selectGreaterThanRecord(id,selfEntity.getRoleGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        RoleEntity selfEntity=roleMapper.selectByPrimaryKey(id);
        RoleEntity ltEntity=roleMapper.selectLessThanRecord(id,selfEntity.getRoleGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(RoleEntity toEntity,RoleEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getRoleOrderNum();
            toEntity.setRoleOrderNum(selfEntity.getRoleOrderNum());
            selfEntity.setRoleOrderNum(newNum);
            roleMapper.updateByPrimaryKeySelective(toEntity);
            roleMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
