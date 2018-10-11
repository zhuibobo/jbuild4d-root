package com.jbuild4d.web.platform.controller.builder.dataset;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.platform.builder.service.IDatasetService;
import com.jbuild4d.platform.builder.service.ITableFieldService;
import com.jbuild4d.platform.builder.service.ITableGroupService;
import com.jbuild4d.platform.builder.service.ITableService;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.platform.system.service.IEnvVariableService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/DataSet/DataSetDesign")
public class DataSetDesignController {

    @Autowired
    IDatasetService datasetService;

    @RequestMapping(value = "EditDataSet", method = RequestMethod.GET)
    public ModelAndView editDataSet(String recordId, String op, String groupId) throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView("Builder/DataSet/DataSetEdit");
        JB4DSessionUtility.setUserInfoToMV(modelAndView);
        modelAndView.addObject("op",op);
        return modelAndView;
    }

    @RequestMapping(value = "/SaveDataSetEdit")
    @ResponseBody
    public JBuild4DResponseVo saveDataSetEdit(String op,String dataSetId, String dataSetVoJson) throws JBuild4DGenerallyException, IOException {
        DataSetVo dataSetVo = JsonUtility.toObject(dataSetVoJson, DataSetVo.class);
        datasetService.saveDataSetVo(JB4DSessionUtility.getSession(), dataSetId, dataSetVo);
        return JBuild4DResponseVo.success("");
    }
}
