package com.jbuild4d.platform.sso.service.impl;
import java.util.Date;
import java.util.List;

import com.jbuild4d.base.dbaccess.dao.sso.DepartmentMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.sso.service.IOnOrganChangeAware;
import com.jbuild4d.platform.sso.service.IDepartmentService;
import org.mybatis.spring.SqlSessionTemplate;

public class DepartmentServiceImpl extends BaseServiceImpl<DepartmentEntity> implements IDepartmentService, IOnOrganChangeAware
{
    DepartmentMapper departmentMapper;
    public DepartmentServiceImpl(DepartmentMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        departmentMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DepartmentEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DepartmentEntity>() {
            @Override
            public DepartmentEntity run(JB4DSession jb4DSession,DepartmentEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
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
    public List<DepartmentEntity> getDepartmentsByOrganId(String organId) {
        return departmentMapper.selectDepartmentsByOrganId(organId);
    }

    public DepartmentEntity getOrganRootDepartment(JB4DSession jb4DSession,String organId){
        return departmentMapper.selectOrganRootDepartment(organId);
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