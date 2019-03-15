package com.jbuild4d.test.web.platform.rest.builder.dataset;

import com.jbuild4d.base.tools.JsonUtility;
import com.jbuild4d.platform.builder.vo.SQLResolveToDataSetVo;
import com.jbuild4d.test.web.platform.RestTestBase;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public class DataSetSQLDesignerRestTest extends RestTestBase {
    @Test
    public void validateSQLEnable() throws Exception {
        JBuild4DResponseVo responseVo=validateSQLEnable("select TDEV_TEST_1.*,TDEV_TEST_2.F_TABLE1_ID,'address' address,'sex' sex from TDEV_TEST_1 join TDEV_TEST_2 on TDEV_TEST_1.ID=TDEV_TEST_2.F_TABLE1_ID where TDEV_TEST_1.ID='#{ApiVar.当前用户所在组织ID}'");
        Assert.assertTrue(responseVo.isSuccess());
    }

    public JBuild4DResponseVo validateSQLEnable(String sqlText) throws Exception {
        MockHttpServletRequestBuilder requestBuilder = post("/PlatForm/Builder/DataSet/DataSetSQLDesigner/ValidateSQLEnable.do");
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
