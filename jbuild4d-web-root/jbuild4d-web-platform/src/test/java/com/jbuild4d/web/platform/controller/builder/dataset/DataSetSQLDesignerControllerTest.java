package com.jbuild4d.web.platform.controller.builder.dataset;

import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.web.platform.controller.ControllerTestBase;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public class DataSetSQLDesignerControllerTest  extends ControllerTestBase {
    @Test
    public void validateSQLEnable() throws Exception {
        MockHttpServletRequestBuilder requestBuilder = post("/PlatForm/Builder/DataSet/DataSetSQLDesigner/ValidateSQLEnable.do");
        requestBuilder.sessionAttr("JB4DSession", getSession());
        requestBuilder.param("sqlText", "select TDEV_TEST_1.*,TDEV_TEST_2.F_TABLE1_ID,'address' address,'sex' sex from TDEV_TEST_1 join TDEV_TEST_2 on TDEV_TEST_1.ID=TDEV_TEST_2.F_TABLE1_ID where TDEV_TEST_1.ID='#{ApiVar.当前用户所在组织ID}'");
        MvcResult result = mockMvc.perform(requestBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        System.out.println(json);
        Assert.assertTrue(responseVo.isSuccess());
    }
}
