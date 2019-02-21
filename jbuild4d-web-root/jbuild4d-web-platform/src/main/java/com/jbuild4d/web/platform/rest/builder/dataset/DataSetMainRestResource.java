package com.jbuild4d.web.platform.rest.builder.dataset;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.base.tools.common.search.GeneralSearchUtility;
import com.jbuild4d.platform.builder.dataset.IDatasetGroupService;
import com.jbuild4d.platform.builder.dataset.IDatasetService;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import com.jbuild4d.web.platform.model.ZTreeNodeVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/DataSet/DataSetMain")
public class DataSetMainRestResource  {
    @Autowired
    IDatasetService datasetService;

    @Autowired
    IDatasetGroupService datasetGroupService;

    @RequestMapping(value = "/GetDataSetData")
    public JBuild4DResponseVo getDataSetData(String op, String recordId) throws JBuild4DGenerallyException, IOException {
        DataSetVo dataSetVo = datasetService.getVoByPrimaryKey(JB4DSessionUtility.getSession(),recordId);
        return JBuild4DResponseVo.success("获取数据成功!",dataSetVo);
    }

    @RequestMapping(value = "/GetApiDataSetVoStructure")
    public JBuild4DResponseVo getApiDataSetVoStructure(String op,String recordId,String groupId,String fullClassName) throws InstantiationException, IllegalAccessException {
        DataSetVo dataSetVo = datasetService.getApiDataSetVoStructure(JB4DSessionUtility.getSession(),recordId,op,groupId,fullClassName);
        return JBuild4DResponseVo.success("获取数据成功!",dataSetVo);
    }

    @RequestMapping(value = "/SaveDataSetEdit")
    public JBuild4DResponseVo saveDataSetEdit(String op,String dataSetId, String dataSetVoJson) throws JBuild4DGenerallyException, IOException {
        DataSetVo dataSetVo = JsonUtility.toObjectIgnoreProp(dataSetVoJson, DataSetVo.class);
        datasetService.saveDataSetVo(JB4DSessionUtility.getSession(), dataSetId, dataSetVo);
        return JBuild4DResponseVo.opSuccess();
    }

    @RequestMapping(value = "/DeleteDataSet")
    public JBuild4DResponseVo deleteDataSet(String dataSetId) throws JBuild4DGenerallyException, IOException {
        datasetService.deleteByKey(JB4DSessionUtility.getSession(), dataSetId);
        return JBuild4DResponseVo.success("删除数据集成功!");
    }

    @RequestMapping(value = "/GetListData", method = RequestMethod.POST)
    public JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String searchCondition) throws IOException, ParseException {

        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<DatasetEntity> proOrganPageInfo=datasetService.getPage(jb4DSession,pageNum,pageSize,searchMap);
        JBuild4DResponseVo responseVo=new JBuild4DResponseVo();
        responseVo.setData(proOrganPageInfo);
        responseVo.setMessage("获取成功");
        responseVo.setSuccess(true);
        return responseVo;
    }

    @RequestMapping(value = "/GetDataSetsForZTreeNodeList", method = RequestMethod.POST)
    public JBuild4DResponseVo getDataSetsForZTreeNodeList(){
        try {
            JBuild4DResponseVo responseVo=new JBuild4DResponseVo();
            responseVo.setSuccess(true);
            responseVo.setMessage("获取数据成功！");

            JB4DSession jb4DSession= JB4DSessionUtility.getSession();

            List<DatasetGroupEntity> tableGroupEntityList=datasetGroupService.getALL(jb4DSession);
            List<DatasetEntity> tableEntityList=datasetService.getALL(jb4DSession);

            responseVo.setData(ZTreeNodeVo.parseDataSetToZTreeNodeList(tableGroupEntityList,tableEntityList));

            return responseVo;
        }
        catch (Exception ex){
            return JBuild4DResponseVo.error(ex.getMessage());
        }
    }
}
