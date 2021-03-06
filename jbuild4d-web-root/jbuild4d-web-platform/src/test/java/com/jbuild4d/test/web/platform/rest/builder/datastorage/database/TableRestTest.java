package com.jbuild4d.test.web.platform.rest.builder.datastorage.database;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.tools.JsonUtility;
import com.jbuild4d.core.base.tools.UUIDUtility;
import com.jbuild4d.core.base.list.IListWhereCondition;
import com.jbuild4d.core.base.list.ListUtility;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.datastorage.ITableFieldService;
import com.jbuild4d.platform.builder.datastorage.ITableGroupService;
import com.jbuild4d.platform.builder.datastorage.ITableService;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.test.web.platform.RestTestBase;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
public class TableRestTest extends RestTestBase {

    @Autowired
    private ITableGroupService tableGroupService;

    @Autowired
    private ITableService tableService;

    @Autowired
    private ITableFieldService tableFieldService;

    /*@Autowired
    private TableController tableController;*/

    @Test
    public void saveTableEdit() throws Exception {
        saveTableEdit_Add("TDEV_TEST_1","开发测试表1",null);

        List<TableFieldVO> appendTableFieldVO=new ArrayList<>();
        TableFieldVO ntextField1 = newFiled(getSession(), "TDEV_TEST_2", "F_TABLE1_ID", "F_TABLE1_ID",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.NVarCharType, 50, 0,
                "", "", "", "");
        appendTableFieldVO.add(ntextField1);
        saveTableEdit_Add("TDEV_TEST_2","开发测试表1",appendTableFieldVO);

        saveTableEdit_Update();
    }

    private void saveTableEdit_Add(String tableName,String tableCaption,List<TableFieldVO> appendTableFieldVO) throws Exception {
        TableEntity newTable = getTableEntity(getSession(), tableName, tableCaption, tableName);

        //验证是否存在同名的表，存在则删除表
        MockHttpServletRequestBuilder requestBuilder = post("/PlatFormRest/Builder/DataStorage/DataBase/Table/ValidateTableIsNoExist.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());
        requestBuilder.param("tableName", newTable.getTableName());
        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        if (!responseVo.isSuccess()) {
            TableEntity tempTableEntity=tableService.getByTableName(getSession(),newTable.getTableName());
            tableService.deleteByKeyNotValidate(getSession(),tempTableEntity.getTableId(), JBuild4DProp.getWarningOperationCode());
            tableFieldService.deleteByTableId(getSession(),tempTableEntity.getTableId());
            tableService.deletePhysicsTable(getSession(),newTable.getTableName(),JBuild4DProp.getWarningOperationCode());
        }
        requestBuilder = post("/PlatFormRest/Builder/DataStorage/DataBase/Table/SaveTableEdit.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());

        String tableEntityJson = URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(newTable), "utf-8"), "utf-8");

        //调用接口，获取通用模版
        List<TableFieldVO> templateFieldVoList = getFieldVoListGeneralTemplate();
        TableFieldVO ntextField1 = newFiled(getSession(), newTable.getTableId(), "F_NTEXT_1", "F_NTEXT_1",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");
        templateFieldVoList.add(ntextField1);

        TableFieldVO ntextField2 = newFiled(getSession(), newTable.getTableId(), "F_NTEXT_2", "F_NTEXT_2",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");
        templateFieldVoList.add(ntextField2);

        TableFieldVO ntextField3 = newFiled(getSession(), newTable.getTableId(), "F_NTEXT_3", "F_NTEXT_3",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");
        templateFieldVoList.add(ntextField3);

        if(appendTableFieldVO!=null) {
            templateFieldVoList.addAll(appendTableFieldVO);
        }

        String fieldVoListJson = URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(templateFieldVoList), "utf-8"), "utf-8");
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

    private void saveTableEdit_Update() throws Exception {
        TableEntity tableEntity=tableService.getByTableName(getSession(),"TDEV_TEST_1");
        JBuild4DResponseVo responseVo=getEditTableData("update",tableEntity.getTableId());
        List<TableFieldVO> tableFieldVOList=new ArrayList<>();
        List<Map> mapList=(List<Map>)responseVo.getExKVData().get("tableFieldsData");
        for (Map mapVo : mapList) {
            String recordString=JsonUtility.toObjectString(mapVo);
            tableFieldVOList.add(JsonUtility.toObject(recordString,TableFieldVO.class));
        }

        //新增列
        TableFieldVO ntextField = newFiled(getSession(), tableEntity.getTableId(), "F_NTEXT_N_1", "F_NTEXT_N_1",
                TrueFalseEnum.False, TrueFalseEnum.True,
                TableFieldTypeEnum.TextType, 0, 0,
                "", "", "", "");
        tableFieldVOList.add(ntextField);

        //删除列
        tableFieldVOList.remove(ListUtility.WhereSingle(tableFieldVOList, new IListWhereCondition<TableFieldVO>() {
            @Override
            public boolean Condition(TableFieldVO item) {
                return item.getFieldName().equals("F_NTEXT_1");
            }
        }));

        //修改列
        TableFieldVO ntextField2=ListUtility.WhereSingle(tableFieldVOList, new IListWhereCondition<TableFieldVO>() {
            @Override
            public boolean Condition(TableFieldVO item) {
                return item.getFieldName().equals("F_NTEXT_2");
            }
        });
        ntextField2.setFieldDataType(TableFieldTypeEnum.NVarCharType.getText());
        ntextField2.setFieldDataLength(200);

        //调用方法

        MockHttpServletRequestBuilder requestBuilder = post("/PlatFormRest/Builder/DataStorage/DataBase/Table/SaveTableEdit.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());
        String tableEntityJson = URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(tableEntity), "utf-8"), "utf-8");
        String fieldVoListJson =  URLEncoder.encode(URLEncoder.encode(JsonUtility.toObjectString(tableFieldVOList), "utf-8"), "utf-8");
        requestBuilder.param("op", "update");
        requestBuilder.param("tableEntityJson", tableEntityJson);
        requestBuilder.param("fieldVoListJson", fieldVoListJson);
        requestBuilder.param("ignorePhysicalError", "false");

        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        System.out.println(json);
        Assert.assertTrue(responseVo.isSuccess());
    }

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
            tableGroupService.saveSimple(jb4DSession,tableGroupEntity.getTableGroupId(),tableGroupEntity);
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

    private List<TableFieldVO> getFieldVoListGeneralTemplate() throws Exception {
        JBuild4DResponseVo responseVo = getEditTableData("add","Empty");
        System.out.println(responseVo);
        //JBuild4DResponseVo responseVo= tableController.GetEditTableData("xxx","add","DevGroup");

        List<TableFieldVO> tableFieldVOList=new ArrayList<>();
        List<Map> mapList=((Map<String,List<Map>>)responseVo.getExKVData().get("templateFieldGroup")).get("通用模版");
        for (Map mapVo : mapList) {
            String recordString=JsonUtility.toObjectString(mapVo);
            tableFieldVOList.add(JsonUtility.toObject(recordString,TableFieldVO.class));
        }
        return tableFieldVOList;
    }

    private JBuild4DResponseVo getEditTableData(String op,String recordId) throws Exception {
        MockHttpServletRequestBuilder requestBuilder =post("/PlatFormRest/Builder/DataStorage/DataBase/Table/GetEditTableData.do");
        requestBuilder.sessionAttr("JB4DSession",getSession());
        requestBuilder.param("op",op);
        requestBuilder.param("groupId","DevGroup");
        requestBuilder.param("recordId",recordId);
        MvcResult result=mockMvc.perform(requestBuilder).andReturn();
        String json=result.getResponse().getContentAsString();
        return JsonUtility.toObject(json, JBuild4DResponseVo.class);
    }

}
