package com.jbuild4d.web.platform.rest;

import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.builder.dataset.IDatasetGroupService;
import com.jbuild4d.platform.builder.datastorage.ITableFieldService;
import com.jbuild4d.platform.builder.datastorage.ITableGroupService;
import com.jbuild4d.platform.builder.module.IModuleService;
import com.jbuild4d.platform.sso.service.IOrganService;
import com.jbuild4d.platform.sso.service.IOrganTypeService;
import com.jbuild4d.platform.sso.service.IRoleGroupService;
import com.jbuild4d.platform.system.devdemo.IDevDemoTLTreeService;
import com.jbuild4d.platform.system.devdemo.IDevDemoTreeTableService;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.platform.system.service.*;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/InitializationSystem")
public class InitializationSystemRestResource {

    @Autowired
    private IMenuService menuService;

    @Autowired
    private IDictionaryGroupService dictionaryGroupService;

    @Autowired
    private IDictionaryService dictionaryService;

    @Autowired
    private IDevDemoTreeTableService devDemoTreeTableService;

    @Autowired
    private IDevDemoTLTreeService devDemoTLTreeService;

    @Autowired
    private IOrganService organService;

    @Autowired
    private IOrganTypeService organTypeService;

    @Autowired
    private ITableGroupService tableGroupService;

    @Autowired
    private ITableFieldService tableFieldService;

    @Autowired
    private IDatasetGroupService datasetGroupService;

    @Autowired
    private IModuleService moduleService;

    @Autowired
    private IJb4dCacheService jb4dCacheService;

    @Autowired
    private ISettingService settingService;

    @Autowired
    private IRoleGroupService roleGroupService;

    @RequestMapping(value = "/Running", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo running() throws JBuild4DGenerallyException {
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();

        //初始化菜单
        menuService.initSystemData(jb4DSession);

        //初始化字典
        dictionaryGroupService.initSystemData(jb4DSession,dictionaryService);

        //初始化测试树数据
        devDemoTreeTableService.deleteByKey(jb4DSession,"0");
        devDemoTreeTableService.createRootNode(jb4DSession);

        devDemoTLTreeService.deleteByKey(jb4DSession,"0");
        devDemoTLTreeService.createRootNode(jb4DSession);

        //初始化根组织
        organTypeService.deleteByKeyNotValidate(jb4DSession,"0", JBuild4DProp.getWarningOperationCode());
        organTypeService.createDefaultOrganType(jb4DSession);
        organService.deleteByKeyNotValidate(jb4DSession,"0", JBuild4DProp.getWarningOperationCode());
        organService.createRootOrgan(jb4DSession);

        //初始化根表分组
        tableGroupService.deleteByKeyNotValidate(jb4DSession,"0", JBuild4DProp.getWarningOperationCode());
        TableGroupEntity rootTableGroupEntity=tableGroupService.createRootNode(jb4DSession);

        tableGroupService.deleteByKeyNotValidate(jb4DSession,"TableGroupJBuild4DSystem", JBuild4DProp.getWarningOperationCode());
        tableGroupService.createSystemTableGroupNode(jb4DSession,rootTableGroupEntity);

        //初始化表模版
        tableFieldService.createGeneralTemplate(jb4DSession);

        //初始化数据集分组
        datasetGroupService.createRootNode(jb4DSession);

        //初始化模块分组
        moduleService.createRootNode(jb4DSession);

        //初始化缓存Key
        jb4dCacheService.initSystemData(jb4DSession);

        //初始化系统参数
        settingService.initSystemData(jb4DSession);

        //初始化根角色组
        roleGroupService.initSystemData(jb4DSession);

        return JBuild4DResponseVo.success("系统数据初始化成功！");
    }
}
