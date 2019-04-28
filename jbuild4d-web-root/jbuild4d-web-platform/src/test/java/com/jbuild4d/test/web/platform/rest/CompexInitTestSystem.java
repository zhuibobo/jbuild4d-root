package com.jbuild4d.test.web.platform.rest;


import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.ModuleEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
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
import com.jbuild4d.platform.builder.button.api.ButtonAPIService;
import com.jbuild4d.platform.builder.dataset.IDatasetGroupService;
import com.jbuild4d.platform.builder.dataset.IDatasetService;
import com.jbuild4d.platform.builder.datastorage.ITableGroupService;
import com.jbuild4d.platform.builder.datastorage.ITableService;
import com.jbuild4d.platform.builder.exenum.DataSetTypeEnum;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.module.IModuleService;
import com.jbuild4d.platform.builder.vo.*;
import com.jbuild4d.test.web.platform.RestTestBase;
import org.apache.commons.lang3.StringUtils;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import javax.xml.bind.JAXBException;
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

    @Autowired
    IDatasetGroupService datasetGroupService;

    @Autowired
    IDatasetService datasetService;

    @Autowired
    IModuleService moduleService;

    @Autowired
    ButtonAPIService buttonAPIService;

    @Test
    public void Init() throws Exception {
        //创建数据库连接

        //创建表分组
        createTableGroup(getSession());
        //创建数据集
        createDataSetGroup(getSession());
        //创建模块分组
        createModuleGroup(getSession());
    }

    @Test
    public void tets1() throws JAXBException {
        List<ButtonAPIGroupVo> buttonAPIGroupVos=buttonAPIService.getButtonAPIGroupList();
        System.out.println(buttonAPIGroupVos);
    }

    private void createModuleGroup(JB4DSession jb4DSession) throws JBuild4DGenerallyException {

        ModuleEntity rootModuleEntity=new ModuleEntity();
        rootModuleEntity.setModuleId("create_test_business_module");
        rootModuleEntity.setModuleValue("业务模块");
        rootModuleEntity.setModuleText("业务模块");
        rootModuleEntity.setModuleDesc("");
        rootModuleEntity.setModuleStatus(EnableTypeEnum.enable.getDisplayName());
        rootModuleEntity.setModuleParentId(moduleService.getRootId());
        rootModuleEntity.setModuleIssystem(TrueFalseEnum.False.getDisplayName());
        rootModuleEntity.setModuleDelEnable(TrueFalseEnum.True.getDisplayName());
        moduleService.deleteByKeyNotValidate(jb4DSession,rootModuleEntity.getModuleId(),JBuild4DProp.getWarningOperationCode());
        moduleService.saveSimple(jb4DSession,rootModuleEntity.getModuleId(),rootModuleEntity);

        ModuleEntity newsModuleEntity=new ModuleEntity();
        newsModuleEntity.setModuleId("create_test_news_module");
        newsModuleEntity.setModuleValue("信息发布");
        newsModuleEntity.setModuleText("信息发布");
        newsModuleEntity.setModuleDesc("");
        newsModuleEntity.setModuleStatus(EnableTypeEnum.enable.getDisplayName());
        newsModuleEntity.setModuleParentId(rootModuleEntity.getModuleId());
        newsModuleEntity.setModuleIssystem(TrueFalseEnum.False.getDisplayName());
        newsModuleEntity.setModuleDelEnable(TrueFalseEnum.True.getDisplayName());
        moduleService.deleteByKeyNotValidate(jb4DSession,newsModuleEntity.getModuleId(),JBuild4DProp.getWarningOperationCode());
        moduleService.saveSimple(jb4DSession,newsModuleEntity.getModuleId(),newsModuleEntity);

        ModuleEntity personModuleEntity=new ModuleEntity();
        personModuleEntity.setModuleId("create_test_person_module");
        personModuleEntity.setModuleValue("人口信息");
        personModuleEntity.setModuleText("人口信息");
        personModuleEntity.setModuleDesc("");
        personModuleEntity.setModuleStatus(EnableTypeEnum.enable.getDisplayName());
        personModuleEntity.setModuleParentId(rootModuleEntity.getModuleId());
        personModuleEntity.setModuleIssystem(TrueFalseEnum.False.getDisplayName());
        personModuleEntity.setModuleDelEnable(TrueFalseEnum.True.getDisplayName());
        moduleService.deleteByKeyNotValidate(jb4DSession,personModuleEntity.getModuleId(),JBuild4DProp.getWarningOperationCode());
        moduleService.saveSimple(jb4DSession,personModuleEntity.getModuleId(),personModuleEntity);
    }


    private void createDataSetGroup(JB4DSession jb4DSession) throws Exception {
        String demoRootGroupId="createDataSetForDemoSystem_demoRoot";
        String demoNewsGroupId="createDataSetForDemoSystem_demoNewsGroup";
        String demoPersonGroupId="createDataSetForDemoSystem_demoPersonGroup";

        datasetGroupService.deleteByKeyNotValidate(jb4DSession,demoRootGroupId, JBuild4DProp.getWarningOperationCode());
        DatasetGroupEntity rootDatasetGroupEntity=new DatasetGroupEntity();
        rootDatasetGroupEntity.setDsGroupId(demoRootGroupId);
        rootDatasetGroupEntity.setDsGroupValue("业务库数据集");
        rootDatasetGroupEntity.setDsGroupText("业务库数据集");
        rootDatasetGroupEntity.setDsGroupParentId(datasetGroupService.getRootId());
        rootDatasetGroupEntity.setDsGroupIssystem(TrueFalseEnum.False.getDisplayName());
        rootDatasetGroupEntity.setDsGroupDelEnable(TrueFalseEnum.True.getDisplayName());
        datasetGroupService.saveSimple(jb4DSession,demoRootGroupId,rootDatasetGroupEntity);


        datasetGroupService.deleteByKeyNotValidate(jb4DSession,demoNewsGroupId, JBuild4DProp.getWarningOperationCode());
        DatasetGroupEntity newsDatasetGroupEntity=new DatasetGroupEntity();
        newsDatasetGroupEntity.setDsGroupId(demoNewsGroupId);
        newsDatasetGroupEntity.setDsGroupValue("信息发布");
        newsDatasetGroupEntity.setDsGroupText("信息发布");
        newsDatasetGroupEntity.setDsGroupParentId(demoRootGroupId);
        newsDatasetGroupEntity.setDsGroupIssystem(TrueFalseEnum.False.getDisplayName());
        newsDatasetGroupEntity.setDsGroupDelEnable(TrueFalseEnum.True.getDisplayName());
        datasetGroupService.saveSimple(jb4DSession,demoNewsGroupId,newsDatasetGroupEntity);

        //region 关联栏目的新闻集合
        String newsDataSetId="TEST_DEMO_NEWS_DATASET_1";
        datasetService.deleteByKeyNotValidate(getSession(),newsDataSetId, JBuild4DProp.getWarningOperationCode());
        JBuild4DResponseVo jBuild4DResponseVo = this.validateSQLEnable("select TTEST_CMS_NEW.*,TTEST_CMS_COLUMN.F_COLUMN_NAME,'address' ADDRESS,'sex' SEX from TTEST_CMS_NEW join TTEST_CMS_COLUMN on TTEST_CMS_NEW.F_COLUMN_ID=TTEST_CMS_COLUMN.ID where TTEST_CMS_NEW.F_ORGAN_ID='#{ApiVar.当前用户所在组织ID}'");
        SQLResolveToDataSetVo resolveToDataSetVo = (SQLResolveToDataSetVo) jBuild4DResponseVo.getData();
        DataSetVo dataSetVo = new DataSetVo();
        dataSetVo.setDsId(newsDataSetId);
        dataSetVo.setDsCaption("栏目新闻-单元测试数据集");
        dataSetVo.setDsName("栏目新闻-单元测试数据集");
        dataSetVo.setDsType(DataSetTypeEnum.SQLDataSet.getText());
        dataSetVo.setDsIssystem(TrueFalseEnum.False.getDisplayName());
        dataSetVo.setDsGroupId(newsDatasetGroupEntity.getDsGroupId());
        dataSetVo.setDsStatus(EnableTypeEnum.enable.getDisplayName());
        dataSetVo.setDsSqlSelectText(resolveToDataSetVo.getSqlWithEnvText());
        dataSetVo.setDsSqlSelectValue(resolveToDataSetVo.getSqlWithEnvValue());
        dataSetVo.setDsClassName("");
        dataSetVo.setDsRestStructureUrl("");
        dataSetVo.setDsRestDataUrl("");

        for (DataSetColumnVo dataSetColumnVo : resolveToDataSetVo.getDataSetVo().getColumnVoList()) {
            dataSetColumnVo.setColumnId(UUIDUtility.getUUID());
        }

        for (DataSetRelatedTableVo dataSetRelatedTableVo : resolveToDataSetVo.getDataSetVo().getRelatedTableVoList()) {
            dataSetRelatedTableVo.setRtId(UUIDUtility.getUUID());
        }

        dataSetVo.setColumnVoList(resolveToDataSetVo.getDataSetVo().getColumnVoList());
        dataSetVo.setRelatedTableVoList(resolveToDataSetVo.getDataSetVo().getRelatedTableVoList());

        MockHttpServletRequestBuilder requestBuilder = post("/PlatFormRest/Builder/DataSet/DataSetMain/SaveDataSetEdit.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());
        requestBuilder.param("op","add");
        requestBuilder.param("dataSetVoJson", JsonUtility.toObjectString(dataSetVo));
        requestBuilder.param("dataSetId",newsDataSetId);
        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        System.out.printf(json);
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());
        //endregion

        datasetGroupService.deleteByKeyNotValidate(jb4DSession,demoPersonGroupId, JBuild4DProp.getWarningOperationCode());
        DatasetGroupEntity personDatasetGroupEntity=new DatasetGroupEntity();
        personDatasetGroupEntity.setDsGroupId(demoPersonGroupId);
        personDatasetGroupEntity.setDsGroupValue("人口信息");
        personDatasetGroupEntity.setDsGroupText("人口信息");
        personDatasetGroupEntity.setDsGroupParentId(demoRootGroupId);
        personDatasetGroupEntity.setDsGroupIssystem(TrueFalseEnum.False.getDisplayName());
        personDatasetGroupEntity.setDsGroupDelEnable(TrueFalseEnum.True.getDisplayName());
        datasetGroupService.saveSimple(jb4DSession,demoPersonGroupId,personDatasetGroupEntity);
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

    public JBuild4DResponseVo validateSQLEnable(String sqlText) throws Exception {
        MockHttpServletRequestBuilder requestBuilder = post("/PlatFormRest/Builder/DataSet/DataSetSQLDesigner/ValidateSQLEnable.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());
        requestBuilder.param("sqlText", sqlText);
        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);

        Object obj=responseVo.getData();
        String temp=JsonUtility.toObjectString(obj);
        SQLResolveToDataSetVo vo=JsonUtility.toObject(temp,SQLResolveToDataSetVo.class);

        responseVo.setData(vo);
        System.out.println(json);
        return responseVo;
    }
}
