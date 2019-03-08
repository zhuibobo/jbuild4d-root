package com.jbuild4d.platform.sso.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dao.sso.UserMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.UserEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.platform.sso.service.IUserService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.List;

public class UserServiceImpl extends BaseServiceImpl<UserEntity> implements IUserService
{
    UserMapper userMapper;
    public UserServiceImpl(UserMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        userMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, UserEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<UserEntity>() {
            @Override
            public UserEntity run(JB4DSession jb4DSession,UserEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                return sourceEntity;
            }
        });
    }

    @Override
    public UserEntity getByAccount(String userAccount) {
        return userMapper.selectByAccount(userAccount);
    }

    @Override
    public PageInfo<UserEntity> getBindRoleUsers(String roleId,int pageNum,int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<UserEntity> list=userMapper.selectBindRoleUsers(roleId);
        PageInfo<UserEntity> pageInfo = new PageInfo<UserEntity>(list);
        if(pageInfo.getSize()==0&&pageInfo.getPageNum()>1){
            return getBindRoleUsers(roleId,pageNum-1,pageSize);
        }
        return pageInfo;
    }

    @Override
    public void statusChange(JB4DSession jb4DSession, String ids, String status) throws JBuild4DGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                UserEntity entity = getByPrimaryKey(jb4DSession, idArray[i]);
                entity.setUserStatus(status);
                userMapper.updateByPrimaryKeySelective(entity);
            }
        }
    }
}

