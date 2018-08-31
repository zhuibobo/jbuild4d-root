package com.jbuild4d.web.platform.controller.builder.datastorage.database;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.service.ITableFieldService;
import com.jbuild4d.platform.builder.service.ITableGroupService;
import com.jbuild4d.platform.builder.service.ITableService;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.web.platform.controller.ControllerTestBase;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/31
 * To change this template use File | Settings | File Templates.
 */
/*@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration(value = "src/main/webapp")
@ContextHierarchy({
        @ContextConfiguration(name = "parent", classes = RootConfig.class),
        @ContextConfiguration(name = "child", classes = WebConfig.class)})*/
public class TableControllerTest  extends ControllerTestBase {

    @Autowired
    private ITableGroupService tableGroupService;

    @Autowired
    private ITableService tableService;

    @Autowired
    private ITableFieldService tableFieldService;

    @Autowired
    private TableController tableController;

    private TableEntity getTableEntity(JB4DSession jb4DSession, String tableId, String tableCaption, String tableName) throws JBuild4DGenerallyException {
        TableEntity tableEntity=new TableEntity();
        tableEntity.setTableId(tableId);
        tableEntity.setTableCaption(tableCaption);
        tableEntity.setTableName(tableName);
        tableEntity.setTableDbname("");
        tableEntity.setTableOrganId(jb4DSession.getOrganId());
        tableEntity.setTableCreateTime(new Date());
        tableEntity.setTableCreater(jb4DSession.getUserName());
        tableEntity.setTableUpdateTime(new Date());
        tableEntity.setTableUpdater(jb4DSession.getUserName());
        tableEntity.setTableServiceValue("");
        tableEntity.setTableType("");
        tableEntity.setTableIssystem(TrueFalseEnum.False.getDisplayName());
        tableEntity.setTableOrderNum(0);
        tableEntity.setTableDesc("");

        TableGroupEntity tableGroupEntity=tableGroupService.getByGroupText(jb4DSession,"开发测试");
        if(tableGroupEntity==null){
            tableGroupEntity=new TableGroupEntity();
            tableGroupEntity.setTableGroupId("DevGroup");
            tableGroupEntity.setTableGroupValue("开发测试");
            tableGroupEntity.setTableGroupText("开发测试");
            tableGroupEntity.setTableGroupOrderNum(0);
            tableGroupEntity.setTableGroupCreateTime(new Date());
            tableGroupEntity.setTableGroupDesc("");
            tableGroupEntity.setTableGroupStatus("");
            tableGroupEntity.setTableGroupParentId(tableGroupService.getRootId());
            tableGroupEntity.setTableGroupIssystem(TrueFalseEnum.False.getDisplayName());
            tableGroupEntity.setTableGroupDelEnable(TrueFalseEnum.False.getDisplayName());
            tableGroupEntity.setTableGroupLinkId("");
            tableGroupService.save(jb4DSession,tableGroupEntity.getTableGroupId(),tableGroupEntity);
        }

        tableEntity.setTableGroupId(tableGroupEntity.getTableGroupId());
        tableEntity.setTableStatus("");
        tableEntity.setTableLinkId("");
        return tableEntity;
    }

    private TableFieldVO newFiled(JB4DSession jb4DSession, String tableId, String fieldName, String fieldCaption,
                                  TrueFalseEnum pk, TrueFalseEnum allowNull,
                                  TableFieldTypeEnum fieldDataType, int dataLength, int decimalLength,
                                  String fieldDefaultValue, String fieldDefaultText, String fieldDesc, String templateName
    ){
        TableFieldVO fieldVO=new TableFieldVO();
        fieldVO.setFieldId(UUIDUtility.getUUIDNotSplit());
        fieldVO.setFieldTableId(tableId);
        fieldVO.setFieldName(fieldName);
        fieldVO.setFieldCaption(fieldCaption);
        fieldVO.setFieldIsPk(pk.getDisplayName());
        fieldVO.setFieldAllowNull(allowNull.getDisplayName());
        fieldVO.setFieldDataType(fieldDataType.getValue());
        fieldVO.setFieldDataLength(dataLength);
        fieldVO.setFieldDecimalLength(decimalLength);
        fieldVO.setFieldDefaultValue(fieldDefaultValue);
        fieldVO.setFieldDefaultText(fieldDefaultText);
        fieldVO.setFieldCreateTime(new Date());
        fieldVO.setFieldCreater(jb4DSession.getUserName());
        fieldVO.setFieldUpdateTime(new Date());
        fieldVO.setFieldUpdater(jb4DSession.getUserName());
        fieldVO.setFieldDesc(fieldDesc);
        fieldVO.setFieldTemplateName(templateName);
        return fieldVO;
    }

    private List<TableFieldVO> getFieldVoListGeneralTemplate() throws Exception {
        MockHttpServletRequestBuilder requestBuilder =post("/PlatForm/Builder/DataStorage/DataBase/Table/GetEditTableData.do");
        requestBuilder.sessionAttr("JB4DSession",getSession());
        requestBuilder.param("op","add");
        requestBuilder.param("groupId","DevGroup");
        requestBuilder.param("recordId","xxx");
        MvcResult result=mockMvc.perform(requestBuilder).andReturn();
        String json=result.getResponse().getContentAsString();
        JBuild4DResponseVo responseVo=JsonUtility.toObject(json, JBuild4DResponseVo.class);
        System.out.println(responseVo);
        //JBuild4DResponseVo responseVo= tableController.GetEditTableData("xxx","add","DevGroup");

        List<TableFieldVO> tableFieldVOList=new ArrayList<>();
        List<Map> mapList=((Map<String,List<Map>>)responseVo.getExKVData().get("templateFieldGroup")).get("GeneralTemplate");
        for (Map mapVo : mapList) {
            String recordString=JsonUtility.toObjectString(mapVo);
            tableFieldVOList.add(JsonUtility.toObject(recordString,TableFieldVO.class));
        }
        return tableFieldVOList;
    }

    @Test
    public void saveTableEdit() throws Exception {
        saveTableEdit_Add();
        saveTableEdit_Update();
    }

    private void saveTableEdit_Update() {

    }


    public void saveTableEdit_Add() throws Exception {
        TableEntity newTable = getTableEntity(getSession(), "T_DEV_TABLE_1", "开发测试表1", "T_DEV_TABLE_1");

        //验证是否存在同名的表，存在则删除表
        MockHttpServletRequestBuilder requestBuilder = post("/PlatForm/Builder/DataStorage/DataBase/Table/ValidateTableIsNoExist.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());
        requestBuilder.param("tableName", newTable.getTableName());
        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        if (!responseVo.isSuccess()) {
            TableEntity tempTableEntity=tableService.getByTableName(getSession(),newTable.getTableName());
            tableService.deleteByKeyNotValidate(getSession(),tempTableEntity.getTableId());
            tableFieldService.deleteByTableId(getSession(),tempTableEntity.getTableId());
            tableService.deletePhysicsTable(getSession(),newTable.getTableName());
        }
        requestBuilder = post("/PlatForm/Builder/DataStorage/DataBase/Table/SaveTableEdit.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());

        String tableEntityJson = URLEncoder.encode(JsonUtility.toObjectString(newTable), "utf-8");

        //调用接口，获取通用模版
        List<TableFieldVO> templateFieldVoList = getFieldVoListGeneralTemplate();
        TableFieldVO ntextField = newFiled(getSession(), "Tempalte", "F_NTEXT", "F_NTEXT",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");
        templateFieldVoList.add(ntextField);

        String fieldVoListJson = URLEncoder.encode(JsonUtility.toObjectString(templateFieldVoList), "utf-8");
        requestBuilder.param("op", "add");
        requestBuilder.param("tableEntityJson", tableEntityJson);
        requestBuilder.param("fieldVoListJson", fieldVoListJson);
        requestBuilder.param("ignorePhysicalError", "false");

        result = mockMvc.perform(requestBuilder).andReturn();
        json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        Assert.assertTrue(responseVo.isSuccess());
        System.out.println(json);
    }


}