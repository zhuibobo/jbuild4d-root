package com.jbuild4d.web.platform.rest.builder.datastorage.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableFieldEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.JsonUtility;
import com.jbuild4d.core.base.tools.UUIDUtility;
import com.jbuild4d.base.service.search.GeneralSearchUtility;
import com.jbuild4d.platform.builder.datastorage.ITableFieldService;
import com.jbuild4d.platform.builder.datastorage.ITableGroupService;
import com.jbuild4d.platform.builder.datastorage.ITableService;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.module.IBuilderConfigService;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.web.platform.model.ZTreeNodeVo;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.net.URLDecoder;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/PlatFormRest/Builder/DataStorage/DataBase/Table")
public class TableRestResource {

    @Autowired
    ITableFieldService tableFieldService;

    @Autowired
    ITableService tableService;

    @Autowired
    IBuilderConfigService builderConfigService;

    @Autowired
    ITableGroupService tableGroupService;

    @RequestMapping(value = "/ValidateTableIsNoExist")
    public JBuild4DResponseVo validateTableIsExist(String tableName){
        //TableEntity tableEntity=tableService.getByTableName(tableName);
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
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


    @RequestMapping(value = "/GetEditTableData")
    public JBuild4DResponseVo getEditTableData(String recordId, String op,String groupId) throws IOException, XPathExpressionException, JBuild4DGenerallyException {
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

    @RequestMapping(value = "/GetTableFieldsByTableId")
    public JBuild4DResponseVo getTableFieldsByTableId(String tableId) throws IOException {
        return JBuild4DResponseVo.getDataSuccess(tableFieldService.getTableFieldsByTableId(tableId));
    }

    @RequestMapping(value = "/GetTableFieldType")
    public JBuild4DResponseVo getFieldDataType() throws JBuild4DGenerallyException {
        return JBuild4DResponseVo.success("", TableFieldTypeEnum.getJsonString());
    }

    @RequestMapping(value = "/GetFieldTemplateName")
    public JBuild4DResponseVo getFieldTemplateName(){
        List<String> namesList=tableFieldService.getFieldTemplateName();
        return JBuild4DResponseVo.success("",namesList);
    }

    @RequestMapping(value = "/GetTemplateFieldsByName")
    public JBuild4DResponseVo getTemplateFieldsByName(String templateName) throws IOException {
        List<TableFieldVO> tableFieldEntityList=tableFieldService.getTemplateFieldsByName(templateName);
        return JBuild4DResponseVo.success("",tableFieldEntityList);
    }

    @RequestMapping(value = "/SaveTableEdit")
    public JBuild4DResponseVo saveTableEdit(String op, String tableEntityJson,String fieldVoListJson,String groupId,boolean ignorePhysicalError) throws IOException, JBuild4DGenerallyException {
        try {
            tableEntityJson = URLDecoder.decode(URLDecoder.decode(tableEntityJson, "utf-8"),"utf-8");
            fieldVoListJson = URLDecoder.decode(URLDecoder.decode(fieldVoListJson, "utf-8"),"utf-8");
            TableEntity tableEntity = JsonUtility.toObject(tableEntityJson, TableEntity.class);
            List<TableFieldVO> tableFieldVOList = JsonUtility.toObjectListIgnoreProp(fieldVoListJson, TableFieldVO.class);
            if (op.equals("add")) {
                if(groupId==null||groupId.equals("")){
                    throw new JBuild4DGenerallyException("groupId不能为空!");
                }
                tableService.newTable(JB4DSessionUtility.getSession(), tableEntity, tableFieldVOList,groupId);
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

    @RequestMapping(value = "/GetListData", method = RequestMethod.POST)
    public JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String searchCondition) throws IOException, ParseException {
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<TableEntity> proOrganPageInfo=tableService.getPage(jb4DSession,pageNum,pageSize,searchMap);
        return JBuild4DResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "/Move", method = RequestMethod.POST)
    public JBuild4DResponseVo move(String recordId, String type , HttpServletRequest request) throws JBuild4DGenerallyException, JsonProcessingException {
        JB4DSession jb4DSession=JB4DSessionUtility.getSession();
        if(type.equals("up")) {
            tableFieldService.moveUp(jb4DSession, recordId);
        }
        else {
            tableFieldService.moveDown(jb4DSession,recordId);
        }
        return JBuild4DResponseVo.opSuccess();
    }

    @RequestMapping(value = "/Delete", method = RequestMethod.POST)
    public JBuild4DResponseVo delete(String recordId) throws JBuild4DGenerallyException {
        try {
            tableService.deleteByKey(JB4DSessionUtility.getSession(), recordId);
            return JBuild4DResponseVo.opSuccess();
        }
        catch (Exception ex){
            throw new JBuild4DGenerallyException(ex.getMessage());
        }
    }

    @RequestMapping(value = "/GetTablesForZTreeNodeList", method = RequestMethod.POST)
    public JBuild4DResponseVo getTablesForZTreeNodeList(){
        try {
            JBuild4DResponseVo responseVo=new JBuild4DResponseVo();
            responseVo.setSuccess(true);
            responseVo.setMessage("获取数据成功！");

            JB4DSession jb4DSession= JB4DSessionUtility.getSession();

            List<TableGroupEntity> tableGroupEntityList=tableGroupService.getALL(jb4DSession);
            List<TableEntity> tableEntityList=tableService.getALL(jb4DSession);

            responseVo.setData(ZTreeNodeVo.parseTableToZTreeNodeList(tableGroupEntityList,tableEntityList));

            return responseVo;
        }
        catch (Exception ex){
            return JBuild4DResponseVo.error(ex.getMessage());
        }
    }

    @RequestMapping(value = "/GetTablesFieldsByTableIds",method = RequestMethod.POST)
    public JBuild4DResponseVo getTablesFieldsByTableIds(@RequestParam("tableIds[]") List<String> tableIds){
        List<TableFieldEntity> tableFieldEntityList=tableFieldService.getTablesFieldsByTableIds(JB4DSessionUtility.getSession(),tableIds);
        List<TableEntity> tableEntityList=tableService.getTablesByTableIds(JB4DSessionUtility.getSession(),tableIds);
        JBuild4DResponseVo responseVo=JBuild4DResponseVo.getDataSuccess(tableFieldEntityList);
        Map<String,Object> exData=new HashedMap();
        exData.put("Tables",tableEntityList);
        responseVo.setExKVData(exData);
        return responseVo;
    }


}
