package com.jbuild4d.web.platform.controller.builder.dataset;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.dbaccess.dbentities.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.TableGroupEntity;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.platform.builder.service.IDatasetService;
import com.jbuild4d.platform.builder.service.ITableGroupService;
import com.jbuild4d.platform.builder.service.ITableService;
import com.jbuild4d.platform.builder.vo.SQLResolveToDataSetVo;
import com.jbuild4d.platform.system.service.IEnvVariableService;
import com.jbuild4d.platform.system.vo.EnvVariableVo;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import com.jbuild4d.web.platform.model.ZTreeNodeVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.xml.xpath.XPathExpressionException;
import java.net.URLDecoder;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/10
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/DataSet/DataSetSQLDesigner")
public class DataSetSQLDesignerController {
    @Autowired
    IEnvVariableService envVariableService;

    @Autowired
    ITableGroupService tableGroupService;

    @Autowired
    ITableService tableService;

    @Autowired
    IDatasetService datasetService;

    @RequestMapping(value = "SQLDesigner", method = RequestMethod.GET)
    public ModelAndView sqlDesigner() throws JsonProcessingException, XPathExpressionException {
        ModelAndView modelAndView=new ModelAndView("Builder/DataSet/SQLDesigner");

        JB4DSessionUtility.setUserInfoToMV(modelAndView);
        return modelAndView;
    }

    @RequestMapping(value = "GetSqlDesignerViewData", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getSqlDesignerViewData() {
        try {
            JBuild4DResponseVo responseVo=new JBuild4DResponseVo();
            responseVo.setSuccess(true);
            responseVo.setMessage("获取数据成功！");

            List<EnvVariableVo> dateTimeVoList=envVariableService.getDateTimeVars();
            List<EnvVariableVo> apiVarVoList=envVariableService.getAPIVars();

            JB4DSession jb4DSession= JB4DSessionUtility.getSession();

            List<TableGroupEntity> tableGroupEntityList=tableGroupService.getALL(jb4DSession);
            List<TableEntity> tableEntityList=tableService.getALL(jb4DSession);

            //modelAndView.addObject("datetimeTreeData", JsonUtility.toObjectString(dateTimeVoList));
            //modelAndView.addObject("apiVarTreeData",JsonUtility.toObjectString(apiVarVoList));
            //modelAndView.addObject("tableTreeData", JsonUtility.toObjectString(ZTreeNodeVo.parseTableToZTreeNodeList(tableGroupEntityList,tableEntityList)));

            responseVo.addExKVData("datetimeTreeData",dateTimeVoList);
            responseVo.addExKVData("apiVarTreeData",apiVarVoList);
            responseVo.addExKVData("tableTreeData",ZTreeNodeVo.parseTableToZTreeNodeList(tableGroupEntityList,tableEntityList));

            return responseVo;
        }
        catch (Exception ex){
            return JBuild4DResponseVo.error(ex.getMessage());
        }
    }

    @RequestMapping(value = "ValidateSQLEnable", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo validateSQLEnable(String sqlText) {
        try {
            JB4DSession jb4DSession = JB4DSessionUtility.getSession();
            //String sqlValue=datasetService.sqlReplaceEnvTextToEnvValue(jb4DSession,sqlText);
            //String sqlWithEnvText=sqlText;
            sqlText= URLDecoder.decode(sqlText,"utf-8");
            SQLResolveToDataSetVo sqlResolveToDataSetVo=datasetService.sqlResolveToDataSetVo(jb4DSession,sqlText);
            //List<TableFieldVO> tableFieldVOList=tableFieldService.getTableFieldsByTableId(tableId);
            return JBuild4DResponseVo.success("校验成功！",sqlResolveToDataSetVo);
        }
        catch (Exception ex){
            return JBuild4DResponseVo.error(ex.getMessage());
        }
    }
}
