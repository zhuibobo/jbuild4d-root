package com.jbuild4d.web.platform.controller.builder.datastorage.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.base.tools.common.search.GeneralSearchUtility;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.service.IBuilderConfigService;
import com.jbuild4d.platform.builder.service.ITableFieldService;
import com.jbuild4d.platform.builder.service.ITableService;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.net.URLDecoder;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/DataStorage/DataBase/Table")
public class TableController {

    @Autowired
    ITableFieldService tableFieldService;

    @Autowired
    ITableService tableService;

    @Autowired
    IBuilderConfigService builderConfigService;

    @RequestMapping(value = "/ValidateTableIsNoExist")
    @ResponseBody
    public JBuild4DResponseVo validateTableIsExist(String tableName){
        //TableEntity tableEntity=tableService.getByTableName(tableName);
        JB4DSession jb4DSession=JB4DSessionUtility.getSession();
        if(tableService.existLogicTableName(jb4DSession,tableName)){
            return JBuild4DResponseVo.error("已经存在名称为"+tableName+"的逻辑表！");
        }
        else{
            if(tableService.existLogicTableName(jb4DSession,tableName)){
                return JBuild4DResponseVo.error("已经存在名称为"+tableName+"的物理表！");
            }
        }
        return JBuild4DResponseVo.success("不存在同名的表！");
    }

    @RequestMapping(value = "/EditTableView", method = RequestMethod.GET)
    public ModelAndView editTableView(String recordId, String op,String groupId) throws IllegalAccessException, InstantiationException, IOException, XPathExpressionException {
        ModelAndView modelAndView=new ModelAndView("Builder/DataStorage/DataBase/TableEdit");
        /*List<String> templateNames=tableFieldService.getFieldTemplateName();
        Map<String,List<TableFieldVO>> templateFieldMap=new HashMap<>();
        for (String templateName : templateNames) {
            List<TableFieldVO> templateFields=tableFieldService.getTemplateFieldsByName(templateName);
            for (TableFieldVO templateField : templateFields) { //修改模版的字段ID,避免重复
                templateField.setFieldId(UUIDUtility.getUUID());
            }
            templateFieldMap.put(templateName,templateFields);
        }
        if(op.equals("add")){
            recordId= UUIDUtility.getUUID();
            TableEntity tableEntity=new TableEntity();
            tableEntity.setTableId(recordId);
            tableEntity.setTableGroupId(groupId);
            modelAndView.addObject("tableEntity",tableEntity);
            modelAndView.addObject("tableFieldsData","[]");
        }
        else {
            modelAndView.addObject("tableEntity",tableService.getByPrimaryKey(JB4DSessionUtility.getSession(),recordId));
            List<TableFieldVO> tableFieldVOList=tableFieldService.getTableFieldsByTableId(recordId);
            modelAndView.addObject("tableFieldsData",JsonUtility.toObjectString(tableFieldVOList));
        }
        modelAndView.addObject("templateFieldGroup",JsonUtility.toObjectString(templateFieldMap));
        modelAndView.addObject("tablePrefix",builderConfigService.getTablePrefix());

        JB4DSessionUtility.setUserInfoToMV(modelAndView);
        modelAndView.addObject("op",op);*/
        return modelAndView;
    }

    @RequestMapping(value = "/GetEditTableData")
    @ResponseBody
    public JBuild4DResponseVo GetEditTableData(String recordId, String op,String groupId) throws IOException, XPathExpressionException {
        JBuild4DResponseVo responseVo=new JBuild4DResponseVo();
        responseVo.setSuccess(true);
        responseVo.setMessage("获取数据成功！");
        List<String> templateNames=tableFieldService.getFieldTemplateName();
        Map<String,List<TableFieldVO>> templateFieldMap=new HashMap<>();
        for (String templateName : templateNames) {
            List<TableFieldVO> templateFields=tableFieldService.getTemplateFieldsByName(templateName);
            for (TableFieldVO templateField : templateFields) { //修改模版的字段ID,避免重复
                templateField.setFieldId(UUIDUtility.getUUID());
                templateField.setFieldTemplateName("FromTemplate:"+templateField.getFieldTemplateName());
            }
            templateFieldMap.put(templateName,templateFields);
        }
        if(op.equals("add")){
            recordId= UUIDUtility.getUUID();
            TableEntity tableEntity=new TableEntity();
            tableEntity.setTableId(recordId);
            tableEntity.setTableGroupId(groupId);
            //modelAndView.addObject("tableEntity",tableEntity);
            //modelAndView.addObject("tableFieldsData","[]");
            responseVo.setData(tableEntity);
            responseVo.addExKVData("tableFieldsData",new ArrayList<>());
        }
        else {
            //modelAndView.addObject("tableEntity",tableService.getByPrimaryKey(JB4DSessionUtility.getSession(),recordId));
            responseVo.setData(tableService.getByPrimaryKey(JB4DSessionUtility.getSession(),recordId));
            List<TableFieldVO> tableFieldVOList=tableFieldService.getTableFieldsByTableId(recordId);
            //modelAndView.addObject("tableFieldsData",JsonUtility.toObjectString(tableFieldVOList));
            responseVo.addExKVData("tableFieldsData",tableFieldVOList);
        }
        //modelAndView.addObject("templateFieldGroup",JsonUtility.toObjectString(templateFieldMap));
        //modelAndView.addObject("tablePrefix",builderConfigService.getTablePrefix());
        responseVo.addExKVData("templateFieldGroup",templateFieldMap);
        responseVo.addExKVData("tablePrefix",builderConfigService.getTablePrefix());
        return responseVo;
    }

    @RequestMapping(value = "/GetTableFieldType")
    @ResponseBody
    public JBuild4DResponseVo getFieldDataType() throws JBuild4DGenerallyException {
        return JBuild4DResponseVo.success("", TableFieldTypeEnum.getJsonString());
    }

    @RequestMapping(value = "/GetFieldTemplateName")
    @ResponseBody
    public JBuild4DResponseVo getFieldTemplateName(){
        List<String> namesList=tableFieldService.getFieldTemplateName();
        return JBuild4DResponseVo.success("",namesList);
    }

    @RequestMapping(value = "/GetTemplateFieldsByName")
    @ResponseBody
    public JBuild4DResponseVo getTemplateFieldsByName(String templateName) throws IOException {
        List<TableFieldVO> tableFieldEntityList=tableFieldService.getTemplateFieldsByName(templateName);
        return JBuild4DResponseVo.success("",tableFieldEntityList);
    }

    @RequestMapping(value = "/SaveTableEdit")
    @ResponseBody
    public JBuild4DResponseVo saveTableEdit(String op, String tableEntityJson,String fieldVoListJson,boolean ignorePhysicalError) throws IOException, JBuild4DGenerallyException {
        try {
            tableEntityJson = URLDecoder.decode(tableEntityJson, "utf-8");
            fieldVoListJson = URLDecoder.decode(fieldVoListJson, "utf-8");
            TableEntity tableEntity = JsonUtility.toObject(tableEntityJson, TableEntity.class);
            List<TableFieldVO> tableFieldVOList = JsonUtility.toObjectList(fieldVoListJson, TableFieldVO.class);
            if (op.equals("add")) {
                tableService.newTable(JB4DSessionUtility.getSession(), tableEntity, tableFieldVOList);
            } else if (op.equals("update")) {
                tableService.updateTable(JB4DSessionUtility.getSession(), tableEntity, tableFieldVOList, ignorePhysicalError);
            }
            return JBuild4DResponseVo.opSuccess();
        }
        catch (Exception ex){
            ex.printStackTrace();
            return JBuild4DResponseVo.error(ex.getMessage());
        }
    }

    @RequestMapping(value = "GetListData", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String searchCondition) throws IOException, ParseException {
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<TableEntity> proOrganPageInfo=tableService.getPage(jb4DSession,pageNum,pageSize,searchMap);
        return JBuild4DResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "Move", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo move(String recordId,String type ,HttpServletRequest request) throws JBuild4DGenerallyException, JsonProcessingException {
        JB4DSession jb4DSession=JB4DSessionUtility.getSession();
        if(type.equals("up")) {
            tableFieldService.moveUp(jb4DSession, recordId);
        }
        else {
            tableFieldService.moveDown(jb4DSession,recordId);
        }
        return JBuild4DResponseVo.opSuccess();
    }

    @RequestMapping(value = "Delete", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo delete(String recordId) throws JBuild4DGenerallyException {
        try {
            tableService.deleteByKey(JB4DSessionUtility.getSession(), recordId);
            return JBuild4DResponseVo.opSuccess();
        }
        catch (Exception ex){
            throw new JBuild4DGenerallyException(ex.getMessage());
        }
    }
}
