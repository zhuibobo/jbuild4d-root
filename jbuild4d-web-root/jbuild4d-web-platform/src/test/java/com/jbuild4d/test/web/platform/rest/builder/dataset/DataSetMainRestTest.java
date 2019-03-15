package com.jbuild4d.test.web.platform.rest.builder.dataset;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.tools.JsonUtility;
import com.jbuild4d.core.base.tools.UUIDUtility;
import com.jbuild4d.platform.builder.exenum.DataSetTypeEnum;
import com.jbuild4d.platform.builder.dataset.IDatasetService;
import com.jbuild4d.platform.builder.vo.DataSetColumnVo;
import com.jbuild4d.platform.builder.vo.DataSetRelatedTableVo;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import com.jbuild4d.platform.builder.vo.SQLResolveToDataSetVo;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/9/3
 * To change this template use File | Settings | File Templates.
 */
public class DataSetMainRestTest extends DataSetSQLDesignerRestTest {

    @Autowired
    IDatasetService datasetService;

    private String dataSetId="UnitTestDataSet001";
    private String dataSetGroupId= DataSetGroupRestTest.devGroupId;

    @Test
    public void addSQLDataSet() throws Exception {

        DatasetEntity existDataSet=datasetService.getVoByPrimaryKey(getSession(),dataSetId);
        if(existDataSet!=null){
            datasetService.deleteByKeyNotValidate(getSession(),dataSetId, JBuild4DProp.getWarningOperationCode());
        }
        if(existDataSet==null) {
            //DataSetSQLDesignerRestTest dataSetSQLDesignerControllerTest = new DataSetSQLDesignerRestTest();
            JBuild4DResponseVo jBuild4DResponseVo = this.validateSQLEnable("select TDEV_TEST_1.*,TDEV_TEST_2.F_TABLE1_ID,'ADDRESS' ADDRESS,'SEX' SEX from TDEV_TEST_1 join TDEV_TEST_2 on TDEV_TEST_1.ID=TDEV_TEST_2.F_TABLE1_ID where TDEV_TEST_1.ID='#{ApiVar.当前用户所在组织ID}'");
            SQLResolveToDataSetVo resolveToDataSetVo = (SQLResolveToDataSetVo) jBuild4DResponseVo.getData();
            JB4DSession jb4DSession=getSession();
            DataSetVo dataSetVo = new DataSetVo();
            dataSetVo.setDsId(dataSetId);
            dataSetVo.setDsCaption("单元测试数据集");
            dataSetVo.setDsName("单元测试数据集");
            dataSetVo.setDsOrganId("0");
            dataSetVo.setDsCreateTime(new Date());
            dataSetVo.setDsCreater(jb4DSession.getUserName());
            dataSetVo.setDsUpdateTime(new Date());
            dataSetVo.setDsUpdater(jb4DSession.getUserName());
            dataSetVo.setDsType(DataSetTypeEnum.SQLDataSet.getText());
            dataSetVo.setDsIssystem(TrueFalseEnum.False.getDisplayName());
            dataSetVo.setDsGroupId(dataSetGroupId);
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

            MockHttpServletRequestBuilder requestBuilder = post("/PlatForm/Builder/DataSet/DataSetMain/SaveDataSetEdit.do");
            requestBuilder.sessionAttr("JB4DSession", getSession());
            requestBuilder.param("op","add");
            requestBuilder.param("dataSetVoJson", JsonUtility.toObjectString(dataSetVo));
            requestBuilder.param("dataSetId",dataSetId);
            MvcResult result = mockMvc.perform(requestBuilder).andReturn();
            String json = result.getResponse().getContentAsString();
            System.out.printf(json);
            JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
            Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());
        }
    }

    @Test
    public void deleteSQLDataSet() throws Exception{
        addSQLDataSet();
        MockHttpServletRequestBuilder requestBuilder = post("/PlatForm/Builder/DataSet/DataSetMain/DeleteDataSet.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());
        requestBuilder.param("dataSetId",dataSetId);
        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        System.out.printf(json);
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());
        //做到这里
    }
}
