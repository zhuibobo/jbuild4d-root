package com.jbuild4d.web.platform.controller.builder.dataset;
import java.util.Date;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetEntity;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.platform.builder.service.IDatasetGroupService;
import com.jbuild4d.web.platform.controller.ControllerTestBase;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.junit.Assert;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/9/3
 * To change this template use File | Settings | File Templates.
 */
@FixMethodOrder(MethodSorters.JVM)
public class DataSetGroupControllerTest  extends ControllerTestBase {

    @Autowired
    IDatasetGroupService datasetGroupService;

    public static String devGroupId="DevGroupId";

    @Test
    public void addDevTestGroup() throws Exception {
        DatasetGroupEntity datasetGroupEntity=datasetGroupService.getByPrimaryKey(getSession(),devGroupId);
        if(datasetGroupEntity==null){
            MockHttpServletRequestBuilder requestBuilder = post("/PlatForm/Builder/DataSet/DataSetGroup/SaveEdit.do");
            requestBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
            requestBuilder.sessionAttr("JB4DSession", getSession());
            DatasetGroupEntity groupEntity=new DatasetGroupEntity();
            groupEntity.setDsGroupId(devGroupId);
            groupEntity.setDsGroupValue("DevGroupValue");
            groupEntity.setDsGroupText("DevGroupText");
            groupEntity.setDsGroupOrderNum(0);
            groupEntity.setDsGroupCreateTime(new Date());
            groupEntity.setDsGroupDesc("DevGroupDesc");
            groupEntity.setDsGroupStatus(EnableTypeEnum.enable.getDisplayName());
            groupEntity.setDsGroupParentId(datasetGroupService.getRootId());
            groupEntity.setDsGroupIssystem(TrueFalseEnum.False.getDisplayName());
            groupEntity.setDsGroupDelEnable(TrueFalseEnum.True.getDisplayName());

            requestBuilder.content(JsonUtility.toObjectString(groupEntity));
            MvcResult result = mockMvc.perform(requestBuilder).andReturn();
            String json = result.getResponse().getContentAsString();
            JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
            Assert.assertTrue(responseVo.isSuccess());
        }
    }
}
