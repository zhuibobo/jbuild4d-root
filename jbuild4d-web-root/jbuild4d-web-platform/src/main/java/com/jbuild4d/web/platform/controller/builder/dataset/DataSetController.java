package com.jbuild4d.web.platform.controller.builder.dataset;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.dbaccess.dbentities.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableGroupEntity;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.platform.builder.service.ITableGroupService;
import com.jbuild4d.platform.builder.service.ITableService;
import com.jbuild4d.platform.system.service.IEnvVariableService;
import com.jbuild4d.platform.system.vo.EnvVariableVo;
import com.jbuild4d.web.platform.model.ZTreeNodeVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.xml.xpath.XPathExpressionException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/DataSet/DataSetDesign")
public class DataSetController {

    @Autowired
    IEnvVariableService envVariableService;

    @Autowired
    ITableGroupService tableGroupService;

    @Autowired
    ITableService tableService;

    @RequestMapping(value = "EditDataSet", method = RequestMethod.GET)
    public ModelAndView editDataSet(String recordId, String op, String groupId) throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView("Builder/DataSet/DataSetEdit");
        JB4DSessionUtility.setUserInfoToMV(modelAndView);
        modelAndView.addObject("op",op);
        return modelAndView;
    }

    @RequestMapping(value = "SQLDesigner", method = RequestMethod.GET)
    public ModelAndView sqlDesigner() throws JsonProcessingException, XPathExpressionException {
        ModelAndView modelAndView=new ModelAndView("Builder/DataSet/SQLDesigner");
        List<EnvVariableVo> dateTimeVoList=envVariableService.getDateTimeVars();
        List<EnvVariableVo> apiVarVoList=envVariableService.getAPIVars();

        JB4DSession jb4DSession=JB4DSessionUtility.getSession();

        List<TableGroupEntity> tableGroupEntityList=tableGroupService.getALL(jb4DSession);
        List<TableEntity> tableEntityList=tableService.getALL(jb4DSession);

        modelAndView.addObject("datetimeTreeData", JsonUtility.toObjectString(dateTimeVoList));
        modelAndView.addObject("envVarTreeData",JsonUtility.toObjectString(apiVarVoList));
        modelAndView.addObject("tableTreeData", JsonUtility.toObjectString(ZTreeNodeVo.parseTableToZTreeNodeList(tableGroupEntityList,tableEntityList)));
        JB4DSessionUtility.setUserInfoToMV(modelAndView);
        return modelAndView;
    }
}
