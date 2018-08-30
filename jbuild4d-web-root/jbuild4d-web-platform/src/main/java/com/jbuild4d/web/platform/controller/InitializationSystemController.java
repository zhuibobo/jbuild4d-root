package com.jbuild4d.web.platform.controller;

import com.jbuild4d.base.dbaccess.dbentities.DatasetGroupEntity;
import com.jbuild4d.base.dbaccess.dbentities.DevDemoTreeTableEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableGroupEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.builder.service.IDatasetGroupService;
import com.jbuild4d.platform.builder.service.ITableFieldService;
import com.jbuild4d.platform.builder.service.ITableGroupService;
import com.jbuild4d.platform.organ.service.IOrganService;
import com.jbuild4d.platform.system.devdemo.IDevDemoTLTreeService;
import com.jbuild4d.platform.system.devdemo.IDevDemoTreeTableService;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import com.jbuild4d.platform.system.service.IDictionaryService;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;

@Controller
@RequestMapping(value = "/PlatForm/InitializationSystem")
public class InitializationSystemController {

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
    private ITableGroupService tableGroupService;

    @Autowired
    private ITableFieldService tableFieldService;

    @Autowired
    private IDatasetGroupService datasetGroupService;

    @RequestMapping(value = "/Running", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo running() throws JBuild4DGenerallyException {
        JB4DSession jb4DSession=JB4DSessionUtility.getSession();

        menuService.initSystemData(jb4DSession);
        dictionaryGroupService.initSystemData(jb4DSession,dictionaryService);

        devDemoTreeTableService.deleteByKey(jb4DSession,"0");
        DevDemoTreeTableEntity treeTableRootEntity=devDemoTreeTableService.createRootNode(jb4DSession);

        devDemoTLTreeService.deleteByKey(jb4DSession,"0");
        devDemoTLTreeService.createRootNode(jb4DSession);

        organService.deleteByKey(jb4DSession,"0");
        organService.createRootOrgan(jb4DSession);

        tableGroupService.deleteByKeyNotValidate(jb4DSession,"0");
        TableGroupEntity rootTableGroupEntity=tableGroupService.createRootNode(jb4DSession);

        tableGroupService.deleteByKeyNotValidate(jb4DSession,"TableGroupJBuild4DSystem");
        tableGroupService.createSystemTableGroupNode(jb4DSession,rootTableGroupEntity);

        tableFieldService.createGeneralTemplate(jb4DSession);

        DatasetGroupEntity rootDatasetGroupEntity=datasetGroupService.createRootNode(jb4DSession);

        return JBuild4DResponseVo.success("系统数据初始化成功！");
    }
}
