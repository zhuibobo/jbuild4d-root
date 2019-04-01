package com.jbuild4d.test.web.platform.rest;


import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.base.tools.JsonUtility;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.exception.JBuild4DPhysicalTableException;
import com.jbuild4d.core.base.exception.JBuild4DSQLKeyWordException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.tools.StringUtility;
import com.jbuild4d.core.base.tools.UUIDUtility;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.platform.builder.datastorage.ITableGroupService;
import com.jbuild4d.platform.builder.datastorage.ITableService;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.test.web.platform.RestTestBase;
import org.apache.commons.lang3.StringUtils;
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

public class CompexInitTestSystem extends RestTestBase {

    @Autowired
    ITableGroupService tableGroupService;

    @Autowired
    ITableService tableService;

    @Test
    public void Init() throws Exception {
        //创建表分组
        createTableGroup(getSession());
    }


    public void createTableGroup(JB4DSession jb4DSession) throws Exception {
        String demoRootId="createForDemoSystem_demoRoot";
        String cmsGroupId="createForDemoSystem_demoRoot_CMSGroup";
        String personGroupId="createForDemoSystem_demoRoot_personGroup";
        String familyGroupId="createForDemoSystem_demoRoot_familyGroup";

        tableGroupService.deleteByKeyNotValidate(jb4DSession,demoRootId, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity demoRootTableGroup=new TableGroupEntity();
        demoRootTableGroup.setTableGroupId(demoRootId);
        demoRootTableGroup.setTableGroupParentId(tableGroupService.getRootId());
        demoRootTableGroup.setTableGroupIssystem(TrueFalseEnum.False.getDisplayName());
        demoRootTableGroup.setTableGroupText("业务库[测试]");
        demoRootTableGroup.setTableGroupValue("业务库[测试]");
        tableGroupService.saveSimple(jb4DSession,demoRootId,demoRootTableGroup);

        tableGroupService.deleteByKeyNotValidate(jb4DSession,cmsGroupId, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity cmsInfoTableGroup=new TableGroupEntity();
        cmsInfoTableGroup.setTableGroupId(cmsGroupId);
        cmsInfoTableGroup.setTableGroupParentId(demoRootTableGroup.getTableGroupId());
        cmsInfoTableGroup.setTableGroupIssystem(TrueFalseEnum.False.getDisplayName());
        cmsInfoTableGroup.setTableGroupText("信息发布");
        cmsInfoTableGroup.setTableGroupValue("信息发布");
        tableGroupService.saveSimple(jb4DSession,cmsGroupId,cmsInfoTableGroup);


        //region 创建栏目表--开始
        String cmsColumnTableName="TTEST_CMS_COLUMN";

            //删除旧表
        if(tableService.existLogicTableName(jb4DSession,cmsColumnTableName)) {
            tableService.deleteLogicTableAndFields(jb4DSession, cmsColumnTableName, JBuild4DProp.getWarningOperationCode());
        }
        if(tableService.existPhysicsTableName(jb4DSession,cmsColumnTableName)){
            tableService.deletePhysicsTable(jb4DSession, cmsColumnTableName, JBuild4DProp.getWarningOperationCode());
        }

        TableEntity newTable = getTableEntity(getSession(), StringUtils.join(cmsColumnTableName.split(""), "_"), "信息栏目表", cmsColumnTableName,cmsInfoTableGroup);
            //获取模版
        List<TableFieldVO> cmsColumnFields=getFieldVoListGeneralTemplate("树结构数据模版");
        TableFieldVO columnNameField = newFiled(getSession(), newTable.getTableId(), "F_COLUMN_NAME", "栏目名称",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType, 50, 0,
                "", "", "", "");
        cmsColumnFields.add(columnNameField);

        TableFieldVO displayRenderTypeField = newFiled(getSession(), newTable.getTableId(), "F_RENDERER_TYPE", "显示类型",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType, 20, 0,
                "", "", "显示类型:文字列表,图片列表", "");
        cmsColumnFields.add(displayRenderTypeField);

        MockHttpServletRequestBuilder requestBuilder;
        requestBuilder = post("/PlatFormRest/Builder/DataStorage/DataBase/Table/SaveTableEdit.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());
        String tableEntityJson = URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(newTable), "utf-8"), "utf-8");
        String fieldVoListJson = URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(cmsColumnFields), "utf-8"), "utf-8");

        requestBuilder.param("op", "add");
        requestBuilder.param("tableEntityJson", tableEntityJson);
        requestBuilder.param("fieldVoListJson", fieldVoListJson);
        requestBuilder.param("ignorePhysicalError", "false");

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        Assert.assertTrue(responseVo.isSuccess());
        //创建栏目表--结束
        //endregion

        //region 创建新闻表--开始
        String cmsNewTableName="TTEST_CMS_NEW";

        if(tableService.existLogicTableName(jb4DSession,cmsNewTableName)) {
            tableService.deleteLogicTableAndFields(jb4DSession, cmsNewTableName, JBuild4DProp.getWarningOperationCode());
        }
        if(tableService.existPhysicsTableName(jb4DSession,cmsNewTableName)){
            tableService.deletePhysicsTable(jb4DSession, cmsNewTableName, JBuild4DProp.getWarningOperationCode());
        }
        newTable = getTableEntity(getSession(), StringUtils.join(cmsNewTableName.split(""), "_"), "栏目新闻表", cmsNewTableName,cmsInfoTableGroup);

        //获取模版
        List<TableFieldVO> cmsNewFields=getFieldVoListGeneralTemplate("新闻类模版");

        requestBuilder = post("/PlatFormRest/Builder/DataStorage/DataBase/Table/SaveTableEdit.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());
        tableEntityJson = URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(newTable), "utf-8"), "utf-8");
        fieldVoListJson = URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(cmsNewFields), "utf-8"), "utf-8");

        requestBuilder.param("op", "add");
        requestBuilder.param("tableEntityJson", tableEntityJson);
        requestBuilder.param("fieldVoListJson", fieldVoListJson);
        requestBuilder.param("ignorePhysicalError", "false");

        result = mockMvc.perform(requestBuilder).andReturn();
        json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        Assert.assertTrue(responseVo.isSuccess());
        //创建新闻表--结束
        //endregion

        tableGroupService.deleteByKeyNotValidate(jb4DSession,personGroupId, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity personInfoTableGroup=new TableGroupEntity();
        personInfoTableGroup.setTableGroupId(personGroupId);
        personInfoTableGroup.setTableGroupParentId(demoRootTableGroup.getTableGroupId());
        personInfoTableGroup.setTableGroupIssystem(TrueFalseEnum.False.getDisplayName());
        personInfoTableGroup.setTableGroupText("人口信息");
        personInfoTableGroup.setTableGroupValue("人口信息");
        tableGroupService.saveSimple(jb4DSession,personGroupId,personInfoTableGroup);

        //创建人口信息相关的表


        tableGroupService.deleteByKeyNotValidate(jb4DSession,familyGroupId, JBuild4DProp.getWarningOperationCode());
        TableGroupEntity familyInfoTableGroup=new TableGroupEntity();
        familyInfoTableGroup.setTableGroupId(familyGroupId);
        familyInfoTableGroup.setTableGroupParentId(demoRootTableGroup.getTableGroupId());
        familyInfoTableGroup.setTableGroupIssystem(TrueFalseEnum.False.getDisplayName());
        familyInfoTableGroup.setTableGroupText("家庭信息");
        familyInfoTableGroup.setTableGroupValue("家庭信息");
        tableGroupService.saveSimple(jb4DSession,familyGroupId,familyInfoTableGroup);

        //创建家庭信息相关的表

    }

    private TableEntity getTableEntity(JB4DSession jb4DSession, String tableId, String tableCaption, String tableName,TableGroupEntity tableGroupEntity) throws JBuild4DGenerallyException {
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
        fieldVO.setFieldDataType(fieldDataType.getText());
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

    private List<TableFieldVO> getFieldVoListGeneralTemplate(String templateName) throws Exception {
        JBuild4DResponseVo responseVo = getEditTableData("add","Empty");
        System.out.println(responseVo);

        List<TableFieldVO> tableFieldVOList=new ArrayList<>();
        List<Map> mapList=((Map<String,List<Map>>)responseVo.getExKVData().get("templateFieldGroup")).get(templateName);
        for (Map mapVo : mapList) {
            String recordString= JsonUtility.toObjectString(mapVo);
            tableFieldVOList.add(JsonUtility.toObject(recordString,TableFieldVO.class));
        }
        return tableFieldVOList;
    }

    private JBuild4DResponseVo getEditTableData(String op,String recordId) throws Exception {
        MockHttpServletRequestBuilder requestBuilder =post("/PlatFormRest/Builder/DataStorage/DataBase/Table/GetEditTableData.do");
        requestBuilder.sessionAttr("JB4DSession",getSession());
        requestBuilder.param("op",op);
        requestBuilder.param("groupId","DevGroup1");
        requestBuilder.param("recordId",recordId);
        MvcResult result=mockMvc.perform(requestBuilder).andReturn();
        String json=result.getResponse().getContentAsString();
        return JsonUtility.toObject(json, JBuild4DResponseVo.class);
    }
}
