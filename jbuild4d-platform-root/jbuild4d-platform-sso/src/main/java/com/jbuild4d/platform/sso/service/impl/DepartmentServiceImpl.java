package com.jbuild4d.platform.sso.service.impl;
import java.util.Date;
import java.util.List;

import com.jbuild4d.base.dbaccess.dao.sso.DepartmentMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.tools.UUIDUtility;
import com.jbuild4d.platform.sso.service.IDepartmentUserService;
import com.jbuild4d.platform.sso.service.IOnOrganChangeAware;
import com.jbuild4d.platform.sso.service.IDepartmentService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

public class DepartmentServiceImpl extends BaseServiceImpl<DepartmentEntity> implements IDepartmentService, IOnOrganChangeAware
{
    DepartmentMapper departmentMapper;

    @Autowired
    IDepartmentUserService departmentUserService;

    public DepartmentServiceImpl(DepartmentMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        departmentMapper=_defaultBaseMapper;
        //departmentUserService=_departmentUserService;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, DepartmentEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DepartmentEntity>() {
            @Override
            public DepartmentEntity run(JB4DSession jb4DSession,DepartmentEntity sourceEntity) throws JBuild4DGenerallyException {
                //父节点
                DepartmentEntity parentDepartmentEntity = departmentMapper.selectByPrimaryKey(sourceEntity.getDeptParentId());

                sourceEntity.setDeptChildCount(0);
                sourceEntity.setDeptOrderNum(departmentMapper.nextOrderNum());
                sourceEntity.setDeptCreateTime(new Date());
                String parentIdList;

                parentIdList = parentDepartmentEntity.getDeptParentIdList();
                parentDepartmentEntity.setDeptChildCount(parentDepartmentEntity.getDeptChildCount() + 1);
                departmentMapper.updateByPrimaryKeySelective(parentDepartmentEntity);

                sourceEntity.setDeptParentIdList(parentIdList + "*" + sourceEntity.getDeptId());
                sourceEntity.setDeptOrganId(parentDepartmentEntity.getDeptOrganId());
                sourceEntity.setDeptCreateUserId(jb4DSession.getUserId());
                sourceEntity.setDeptIsRoot(TrueFalseEnum.False.getDisplayName());

                return sourceEntity;
            }
        });
    }

    @Override
    public boolean existOrganRootDept(JB4DSession jb4DSession, String organId){
        int count=departmentMapper.existOrganRootDept(organId);
        return count>0;
    }

    @Override
    public boolean existChildsDepartment(JB4DSession jb4DSession, String id){
        int count=departmentMapper.countChildsDepartment(id);
        return count>0;
    }

    @Override
    public List<DepartmentEntity> getDepartmentsByOrganId(String organId) {
        return departmentMapper.selectDepartmentsByOrganId(organId);
    }

    @Override
    public DepartmentEntity getOrganRootDepartment(JB4DSession jb4DSession, String organId){
        return departmentMapper.selectOrganRootDepartment(organId);
    }

    @Override
    public int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DepartmentEntity departmentEntity=departmentMapper.selectByPrimaryKey(id);
        if(departmentEntity.getDeptIsRoot().equals(TrueFalseEnum.True.getDisplayName())){
            throw new JBuild4DGenerallyException("不能删除根部门!");
        }
        if(departmentUserService.existUserInDepartment(jb4DSession,id)){
            throw new JBuild4DGenerallyException("该部门下存在部门用户,请先删除或者进行迁移!");
        }
        if(!this.existChildsDepartment(jb4DSession,id)){
            return super.deleteByKey(jb4DSession, id);
        }
        else{
            throw new JBuild4DGenerallyException("该部门下存在子部门,请先删除子部门!");
        }
    }

    @Override
    public boolean organCreated(JB4DSession jb4DSession, OrganEntity organEntity) {
        if(!this.existOrganRootDept(jb4DSession,organEntity.getOrganId())) {
            DepartmentEntity departmentEntity = new DepartmentEntity();
            departmentEntity.setDeptId(UUIDUtility.getUUID());
            departmentEntity.setDeptName(organEntity.getOrganName());
            departmentEntity.setDeptShortName(organEntity.getOrganShortName());
            departmentEntity.setDeptNo(organEntity.getOrganNo());
            departmentEntity.setDeptIsVirtual(TrueFalseEnum.True.getDisplayName());
            departmentEntity.setDeptChildCount(0);
            departmentEntity.setDeptCreateTime(new Date());
            departmentEntity.setDeptCreateUserId(jb4DSession.getUserId());
            departmentEntity.setDeptOrderNum(departmentMapper.nextOrderNum());
            departmentEntity.setDeptIsRoot(TrueFalseEnum.True.getDisplayName());
            departmentEntity.setDeptParentId("0");
            departmentEntity.setDeptParentIdList("0");
            departmentEntity.setDeptStatus(EnableTypeEnum.enable.getDisplayName());
            departmentEntity.setDeptOrganId(organEntity.getOrganId());
            departmentEntity.setDeptDesc("组织下的根部门");
            departmentMapper.insert(departmentEntity);
        }
        return true;
    }

    @Override
    public boolean organUpdated(JB4DSession jb4DSession, OrganEntity organEntity) {
        DepartmentEntity departmentEntity=getOrganRootDepartment(jb4DSession,organEntity.getOrganId());
        departmentEntity.setDeptName(organEntity.getOrganName());
        departmentEntity.setDeptShortName(organEntity.getOrganShortName());
        departmentMapper.updateByPrimaryKeySelective(departmentEntity);
        return true;
    }
}