package com.jbuild4d.platform.sso.service.impl;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dao.sso.DepartmentUserMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.*;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.base.tools.common.encryption.digitaldigest.MD5Utility;
import com.jbuild4d.platform.sso.service.IDepartmentService;
import com.jbuild4d.platform.sso.service.IDepartmentUserService;
import com.jbuild4d.platform.sso.service.IOrganService;
import com.jbuild4d.platform.sso.service.IUserService;
import com.jbuild4d.platform.sso.vo.DepartmentUserVo;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

public class DepartmentUserServiceImpl implements IDepartmentUserService
{
    DepartmentUserMapper departmentUserMapper;
    IUserService userService;

    @Autowired
    IDepartmentService departmentService;

    @Autowired
    IOrganService organService;

    public DepartmentUserServiceImpl(DepartmentUserMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService,IUserService _userService){
        //super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        departmentUserMapper=_defaultBaseMapper;
        userService=_userService;
    }

    public static String getValueExistErrorMsg(String value){
        return String.format("已经存在账号为:%s的用户!", value);
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

            if (userService.getByAccount(record.getUserEntity().getUserAccount()) == null) {
                //新增用户
                UserEntity addUser = record.getUserEntity();
                addUser.setUserPassword(MD5Utility.GetMD5Code(accountPassword, true));
                addUser.setUserCreateTime(new Date());
                addUser.setUserCreateUserId(jb4DSession.getUserId());
                addUser.setUserStatus(EnableTypeEnum.enable.getDisplayName());
                addUser.setUserOrderNum(userService.getNextOrderNum(jb4DSession));
                userService.saveSimple(jb4DSession, addUser.getUserId(), addUser);

                //新增部门用户
                DepartmentUserEntity addDepartmentUserEntity = record.getDepartmentUserEntity();
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
                throw new JBuild4DGenerallyException(getValueExistErrorMsg(record.getUserEntity().getUserAccount()));
            }
        }
        else{
            UserEntity oldEntity=userService.getByAccount(record.getUserEntity().getUserAccount());
            if (oldEntity!=null){
                if(!oldEntity.getUserId().equals(record.getUserEntity().getUserId())){
                    throw new JBuild4DGenerallyException(getValueExistErrorMsg(record.getUserEntity().getUserAccount()));
                }
            }

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
    public DepartmentUserVo getEmptyNewVo(JB4DSession jb4DSession, String departmentId) throws JBuild4DGenerallyException {
        DepartmentEntity departmentEntity=departmentService.getByPrimaryKey(jb4DSession,departmentId);
        OrganEntity organEntity=organService.getByPrimaryKey(jb4DSession,departmentEntity.getDeptOrganId());

        DepartmentUserVo departmentUserVo=new DepartmentUserVo();
        departmentUserVo.setDepartmentEntity(departmentEntity);
        departmentUserVo.setOrganEntity(organEntity);

        DepartmentUserEntity departmentUserEntity=new DepartmentUserEntity();
        UserEntity userEntity=new UserEntity();

        String userId= UUIDUtility.getUUID();

        userEntity.setUserId(userId);
        userEntity.setUserOrganId(organEntity.getOrganId());
        userEntity.setUserStatus(EnableTypeEnum.enable.getDisplayName());

        departmentUserEntity.setDuId(UUIDUtility.getUUID());
        departmentUserEntity.setDuIsMain(TrueFalseEnum.True.getDisplayName());
        departmentUserEntity.setDuUserId(userId);
        departmentUserEntity.setDuStatus(EnableTypeEnum.enable.getDisplayName());
        departmentUserEntity.setDuDeptId(departmentId);

        departmentUserVo.setUserEntity(userEntity);
        departmentUserVo.setDepartmentUserEntity(departmentUserEntity);

        return departmentUserVo;
    }

    @Override
    public DepartmentUserVo getVo(JB4DSession jb4DSession, String departmentUserId) throws JBuild4DGenerallyException {
        DepartmentUserEntity departmentUserEntity=departmentUserMapper.selectByPrimaryKey(departmentUserId);
        UserEntity userEntity=userService.getByPrimaryKey(jb4DSession,departmentUserEntity.getDuUserId());
        DepartmentEntity departmentEntity=departmentService.getByPrimaryKey(jb4DSession,departmentUserEntity.getDuDeptId());
        OrganEntity organEntity=organService.getByPrimaryKey(jb4DSession,departmentEntity.getDeptOrganId());

        DepartmentUserVo departmentUserVo=new DepartmentUserVo();
        departmentUserVo.setDepartmentUserEntity(departmentUserEntity);
        departmentUserVo.setUserEntity(userEntity);
        departmentUserVo.setOrganEntity(organEntity);
        departmentUserVo.setDepartmentEntity(departmentEntity);

        return departmentUserVo;
    }

    @Override
    public PageInfo<List<Map<String, Object>>> getDepartmentUser(JB4DSession jb4DSession, Integer pageNum, Integer pageSize, Map<String, Object> searchMap) {
        PageHelper.startPage(pageNum, pageSize);
        //PageHelper.
        List<Map<String,Object>> list=departmentUserMapper.selectDUByDepartment(searchMap);
        PageInfo<List<Map<String,Object>>> pageInfo = new PageInfo(list);
        return pageInfo;
    }

    @Override
    public boolean existUserInDepartment(JB4DSession jb4DSession, String departmentId) {
        int count=departmentUserMapper.selectDepartmentUserCount(departmentId);
        return count>0;
    }


}
