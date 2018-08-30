package com.jbuild4d.web.platform.controller.system.operationlog;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.OperationLogEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.platform.system.service.IOperationLogService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/25
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/System/OperationLog")
public class OperationLogController extends GeneralCRUDImplController<OperationLogEntity> {
    @Autowired
    IOperationLogService operationLogService;

    @Override
    protected IBaseService<OperationLogEntity> getBaseService() {
        return operationLogService;
    }

    @Override
    public String getListViewName() {
        return "System/OperationLog/OperationLogList";
    }

    @Override
    public String getDetailViewName() {
        return "System/OperationLog/OperationLogEdit";
    }

    @Override
    public String getSubSystemName() {
        return this.subSystemName;
    }

    @Override
    public String getModuleName() {
        return "操作日志";
    }
}
