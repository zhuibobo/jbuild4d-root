package com.jbuild4d.web.platform.rest.sso.department;

import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.sso.service.IDepartmentService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/Department")
public class DepartmentRestResource extends GeneralRestResource<DepartmentEntity> {

    @Autowired
    IDepartmentService departmentService;

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "部门管理";
    }

    @Override
    protected IBaseService<DepartmentEntity> getBaseService() {
        return departmentService;
    }

    @RequestMapping(value = "/GetDepartmentsByOrganId", method = RequestMethod.POST)
    public JBuild4DResponseVo getDepartmentsByOrganId(String organId){
        List<DepartmentEntity> departmentEntityList=departmentService.getDepartmentsByOrganId(organId);
        return JBuild4DResponseVo.getDataSuccess(departmentEntityList);
    }
}
