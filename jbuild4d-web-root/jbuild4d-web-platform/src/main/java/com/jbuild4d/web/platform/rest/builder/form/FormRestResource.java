package com.jbuild4d.web.platform.rest.builder.form;

import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.ModuleEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.platform.builder.datastorage.ITableFieldService;
import com.jbuild4d.platform.builder.module.IModuleService;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.platform.builder.webform.IFormResourceService;
import com.jbuild4d.web.platform.model.ZTreeNodeVo;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/Form")
public class FormRestResource extends GeneralRestResource<FormResourceEntity> {

    @Autowired
    IFormResourceService formResourceService;

    @Autowired
    IModuleService moduleService;

    @Autowired
    ITableFieldService tableFieldService;

    @Override
    protected IBaseService<FormResourceEntity> getBaseService() {
        return formResourceService;
    }


    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "模块设计-Web表单设计";
    }

    @RequestMapping(value = "/GetWebFormForZTreeNodeList", method = RequestMethod.POST)
    public JBuild4DResponseVo getWebFormForZTreeNodeList(){
        try {
            JBuild4DResponseVo responseVo=new JBuild4DResponseVo();
            responseVo.setSuccess(true);
            responseVo.setMessage("获取数据成功！");

            JB4DSession jb4DSession= JB4DSessionUtility.getSession();

            List<ModuleEntity> moduleEntityList=moduleService.getALL(jb4DSession);
            List<FormResourceEntity> formResourceEntityList=formResourceService.getALL(jb4DSession);

            responseVo.setData(ZTreeNodeVo.parseWebFormToZTreeNodeList(moduleEntityList,formResourceEntityList));

            return responseVo;
        }
        catch (Exception ex){
            return JBuild4DResponseVo.error(ex.getMessage());
        }
    }

    @RequestMapping(value = "GetFormMainTableFields",method = RequestMethod.POST)
    public JBuild4DResponseVo getFormMainTableFields(String formId) throws JBuild4DGenerallyException, IOException {
        FormResourceEntity formResourceEntity=formResourceService.getByPrimaryKey(JB4DSessionUtility.getSession(),formId);
        List<TableFieldVO> tableFieldVOList=tableFieldService.getTableFieldsByTableName(formResourceEntity.getFormMainTableName());
        return JBuild4DResponseVo.getDataSuccess(tableFieldVOList);
    }
}
