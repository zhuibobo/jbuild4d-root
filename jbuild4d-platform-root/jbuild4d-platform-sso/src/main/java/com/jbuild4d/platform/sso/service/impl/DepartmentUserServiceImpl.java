package com.jbuild4d.platform.sso.service.impl;
import java.util.Date;

import com.jbuild4d.base.dbaccess.dao.sso.DepartmentUserMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentUserEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.UserEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.common.encryption.digitaldigest.MD5Utility;
import com.jbuild4d.platform.sso.service.IDepartmentUserService;
import com.jbuild4d.platform.sso.service.IUserService;
import com.jbuild4d.platform.sso.vo.DepartmentUserVo;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.transaction.annotation.Transactional;

public class DepartmentUserServiceImpl implements IDepartmentUserService
{
    DepartmentUserMapper departmentUserMapper;
    IUserService userService;
    public DepartmentUserServiceImpl(DepartmentUserMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService,IUserService _userService){
        //super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        departmentUserMapper=_defaultBaseMapper;
        userService=_userService;
    }

    @Override
    @Transactional(rollbackFor=JBuild4DGenerallyException.class)
    public int save(JB4DSession jb4DSession, String departmentUserId, DepartmentUserVo record,String accountPassword) throws JBuild4DGenerallyException {
        DepartmentUserEntity departmentUserEntity=departmentUserMapper.selectByPrimaryKey(departmentUserId);

        if(record.getUserEntity()==null||record.getDepartmentUserEntity()==null){
            throw new JBuild4DGenerallyException("用户实体于部门用户实体均不能为空!");
        }
        if(!record.getDepartmentUserEntity().getDuId().equals(departmentUserId)){
            throw new JBuild4DGenerallyException("参数departmentUserId的值于record中的部门用户实体不一致");
        }
        if(record.getUserEntity().getUserId()==null||record.getUserEntity().getUserId().equals("")){
            throw new JBuild4DGenerallyException("record中的用户实体的UserId不能为空");
        }
        if(record.getUserEntity().getUserOrganId()==null||record.getUserEntity().getUserOrganId().equals("")){
            throw new JBuild4DGenerallyException("record中的用户实体的组织ID不能为空!");
        }

        if(departmentUserEntity==null){
            //新增用户
            UserEntity addUser=record.getUserEntity();
            addUser.setUserPassword(MD5Utility.GetMD5Code(accountPassword,true));
            addUser.setUserCreateTime(new Date());
            addUser.setUserCreateUserId(jb4DSession.getUserId());
            addUser.setUserStatus(EnableTypeEnum.enable.getDisplayName());
            addUser.setUserOrderNum(userService.getNextOrderNum(jb4DSession));
            userService.saveSimple(jb4DSession,addUser.getUserId(),addUser);

            //新增部门用户
            DepartmentUserEntity addDepartmentUserEntity=record.getDepartmentUserEntity();
            addDepartmentUserEntity.setDuId(departmentUserId);
            addDepartmentUserEntity.setDuUserId(addUser.getUserId());
            addDepartmentUserEntity.setDuIsMain(TrueFalseEnum.True.getDisplayName());
            addDepartmentUserEntity.setDuCreateTime(new Date());
            addDepartmentUserEntity.setDuCreateUserId(jb4DSession.getUserId());
            addDepartmentUserEntity.setDuStatus(EnableTypeEnum.enable.getDisplayName());
            addDepartmentUserEntity.setDuOrderNum(departmentUserMapper.nextOrderNum());
            departmentUserMapper.insert(addDepartmentUserEntity);
        }
        else{
            //修改用户
            UserEntity updateUser=record.getUserEntity();
            userService.saveSimple(jb4DSession,updateUser.getUserId(),updateUser);

            //修改部门用户
            DepartmentUserEntity updateDepartmentUserEntity=record.getDepartmentUserEntity();
            departmentUserMapper.updateByPrimaryKeySelective(updateDepartmentUserEntity);
        }
        return 1;
    }

    @Override
    public boolean existUserInDepartment(JB4DSession jb4DSession, String departmentId) {
        int count=departmentUserMapper.selectDepartmentUserCount(departmentId);
        return count>0;
    }
}
