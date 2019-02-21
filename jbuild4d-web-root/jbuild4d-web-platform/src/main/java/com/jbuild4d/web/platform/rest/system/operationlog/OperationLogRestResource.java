package com.jbuild4d.web.platform.rest.system.operationlog;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.OperationLogEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.service.IOperationLogService;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/System/OperationLog")
public class OperationLogRestResource extends GeneralRestResource<OperationLogEntity> {

    @Autowired
    IOperationLogService operationLogService;

    @Override
    protected IBaseService<OperationLogEntity> getBaseService() {
        return operationLogService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "操作日志";
    }

}
