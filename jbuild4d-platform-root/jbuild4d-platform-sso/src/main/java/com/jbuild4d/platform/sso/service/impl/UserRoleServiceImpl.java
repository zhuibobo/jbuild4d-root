package com.jbuild4d.platform.sso.service.impl;
import java.util.Date;

import com.jbuild4d.base.dbaccess.dao.sso.UserRoleMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.UserRoleEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.tools.UUIDUtility;
import com.jbuild4d.platform.sso.service.IUserRoleService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.List;

public class UserRoleServiceImpl extends BaseServiceImpl<UserRoleEntity> implements IUserRoleService
{
    UserRoleMapper userRoleMapper;
    public UserRoleServiceImpl(UserRoleMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        userRoleMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, UserRoleEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<UserRoleEntity>() {
            @Override
            public UserRoleEntity run(JB4DSession jb4DSession,UserRoleEntity sourceEntity) throws JBuild4DGenerallyException {

                sourceEntity.setBindOrderNum(userRoleMapper.nextOrderNum());
                sourceEntity.setBindCreateTime(new Date());
                sourceEntity.setBindCreaterId(jb4DSession.getUserId());
                sourceEntity.setBindOrganId(jb4DSession.getOrganId());
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public void bindUsersWithRole(JB4DSession jb4DSession,String roleId, List<String> userIds) throws JBuild4DGenerallyException {
        if(roleId!=null&&!roleId.equals("")){
            for (String userId : userIds) {
                if(!this.bindExist(jb4DSession,roleId,userId)) {
                    UserRoleEntity userRoleEntity = new UserRoleEntity();
                    userRoleEntity.setBindId(UUIDUtility.getUUID());
                    userRoleEntity.setBindRoleId(roleId);
                    userRoleEntity.setBindUserId(userId);
                    this.saveSimple(jb4DSession, roleId, userRoleEntity);
                }
            }
        }
    }

    @Override
    public boolean bindExist(JB4DSession jb4DSession, String roleId, String userId) {
        if(userRoleMapper.bindExist(roleId,userId)>0){
            return true;
        }
        return false;
    }

    @Override
    public void deleteUserRoleBind(String roleId, String userId) {
        userRoleMapper.deleteUserRoleBind(roleId,userId);
    }

    @Override
    public void clearAllRoleMember(String roleId) {
        userRoleMapper.clearAllRoleMember(roleId);
    }
}
