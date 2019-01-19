package com.jbuild4d.web.platform.controller.builder.dataset;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.base.tools.common.search.GeneralSearchUtility;
import com.jbuild4d.platform.builder.dataset.IDatasetService;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.text.ParseException;
import java.util.Map;

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

    @RequestMapping(value = "EditDataSetView", method = RequestMethod.GET)
    public ModelAndView editDataSet(String recordId, String op, String groupId) throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView("Builder/DataSet/DataSetEdit");
        JB4DSessionUtility.setUserInfoToMV(modelAndView);
        modelAndView.addObject("op",op);
        return modelAndView;
    }

    @RequestMapping(value = "/GetDataSetData")
    @ResponseBody
    public JBuild4DResponseVo getDataSetData(String op,String recordId) throws JBuild4DGenerallyException, IOException {
        DataSetVo dataSetVo = datasetService.getVoByPrimaryKey(JB4DSessionUtility.getSession(),recordId);
        return JBuild4DResponseVo.success("获取数据成功!",dataSetVo);
    }

    @RequestMapping(value = "/GetApiDataSetVoStructure")
    @ResponseBody
    public JBuild4DResponseVo getApiDataSetVoStructure(String op,String recordId,String groupId,String fullClassName) throws InstantiationException, IllegalAccessException {
        DataSetVo dataSetVo = datasetService.getApiDataSetVoStructure(JB4DSessionUtility.getSession(),recordId,op,groupId,fullClassName);
        return JBuild4DResponseVo.success("获取数据成功!",dataSetVo);
    }

    @RequestMapping(value = "/SaveDataSetEdit")
    @ResponseBody
    public JBuild4DResponseVo saveDataSetEdit(String op,String dataSetId, String dataSetVoJson) throws JBuild4DGenerallyException, IOException {
        DataSetVo dataSetVo = JsonUtility.toObjectIgnoreProp(dataSetVoJson, DataSetVo.class);
        datasetService.saveDataSetVo(JB4DSessionUtility.getSession(), dataSetId, dataSetVo);
        return JBuild4DResponseVo.opSuccess();
    }

    @RequestMapping(value = "/DeleteDataSet")
    @ResponseBody
    public JBuild4DResponseVo deleteDataSet(String dataSetId) throws JBuild4DGenerallyException, IOException {
        datasetService.deleteByKey(JB4DSessionUtility.getSession(), dataSetId);
        return JBuild4DResponseVo.success("删除数据集成功!");
    }

    @RequestMapping(value = "GetListData", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String searchCondition) throws IOException, ParseException {

        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<DatasetEntity> proOrganPageInfo=datasetService.getPage(jb4DSession,pageNum,pageSize,searchMap);
        JBuild4DResponseVo responseVo=new JBuild4DResponseVo();
        responseVo.setData(proOrganPageInfo);
        responseVo.setMessage("获取成功");
        responseVo.setSuccess(true);
        return responseVo;

        /*JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        //Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<DatasetEntity> proOrganPageInfo=datasetService.getPageByGroupId(jb4DSession,pageNum,pageSize,groupId);
        JBuild4DResponseVo responseVo=new JBuild4DResponseVo();
        responseVo.setData(proOrganPageInfo);
        responseVo.setMessage("获取成功");
        responseVo.setSuccess(true);

        return responseVo;*/
    }
}
