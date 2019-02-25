package com.jbuild4d.test.web.platform.rest.sso.organ;
import java.util.Date;

import com.jbuild4d.base.dbaccess.dbentities.sso.OrganTypeEntity;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.sso.service.impl.OrganTypeServiceImpl;
import com.jbuild4d.test.web.platform.RestTestBase;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

public class OrganTypeRestResourceTest extends RestTestBase {


    /**
     * 新增,修改 组织类型的Value重复测试
     * @throws Exception
     */
    @Test
    public void addOrganTypeTest() throws Exception {
        String recordId= UUIDUtility.getUUID();

        //新加一条记录
        MockHttpServletRequestBuilder requestPostBuilder = post("/PlatFormRest/SSO/OrganType/SaveEdit.do");
        requestPostBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
        requestPostBuilder.sessionAttr("JB4DSession", getSession());

        String organValue="TypeTest0001";
        OrganTypeEntity organTypeEntity=new OrganTypeEntity();
        organTypeEntity.setOrganTypeId(recordId);
        organTypeEntity.setOrganTypeValue(organValue);
        organTypeEntity.setOrganTypeName(organValue);
        organTypeEntity.setOrganTypeDesc("");

        requestPostBuilder.content(JsonUtility.toObjectString(organTypeEntity));
        MvcResult result = mockMvc.perform(requestPostBuilder).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);

        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());

        //修改ID,重复添加一条记录相同的记录
        organTypeEntity.setOrganTypeId(UUIDUtility.getUUID());
        requestPostBuilder.content(JsonUtility.toObjectString(organTypeEntity));
        result = mockMvc.perform(requestPostBuilder).andReturn();
        json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);

        Assert.assertEquals(OrganTypeServiceImpl.getValueExistErrorMsg(organValue),responseVo.getMessage());

        //再新加一条Value为TypeTest0002的记录,并将TypeTest0001的Value改为TypeTest0002时候,将提示错误.改为TypeTest0003时候,操作成功.
        String organValu2="TypeTest0002";
        String recordId2=UUIDUtility.getUUID();
        OrganTypeEntity organTypeEntity2=new OrganTypeEntity();
        organTypeEntity2.setOrganTypeId(recordId2);
        organTypeEntity2.setOrganTypeValue(organValu2);
        organTypeEntity2.setOrganTypeName(organValu2);

        requestPostBuilder.content(JsonUtility.toObjectString(organTypeEntity2));
        result = mockMvc.perform(requestPostBuilder).andReturn();
        json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);

        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());

        organTypeEntity=new OrganTypeEntity();
        organTypeEntity.setOrganTypeId(recordId);
        organTypeEntity.setOrganTypeValue(organValu2);
        organTypeEntity.setOrganTypeName(organValue);

        requestPostBuilder.content(JsonUtility.toObjectString(organTypeEntity));
        result = mockMvc.perform(requestPostBuilder).andReturn();
        json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);

        Assert.assertEquals(OrganTypeServiceImpl.getValueExistErrorMsg(organValu2),responseVo.getMessage());

        organTypeEntity.setOrganTypeValue("TypeTest0003");

        requestPostBuilder.content(JsonUtility.toObjectString(organTypeEntity));
        result = mockMvc.perform(requestPostBuilder).andReturn();
        json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());
        //清空测试数据

        MockHttpServletRequestBuilder requestDeleteBuilder = delete("/PlatFormRest/SSO/OrganType/Delete.do");
        requestDeleteBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
        requestDeleteBuilder.sessionAttr("JB4DSession", getSession());

        requestDeleteBuilder.param("recordId",recordId);
        result = mockMvc.perform(requestDeleteBuilder).andReturn();
        json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());

        requestDeleteBuilder = delete("/PlatFormRest/SSO/OrganType/Delete.do");
        requestDeleteBuilder.contentType(MediaType.APPLICATION_JSON_UTF8);
        requestDeleteBuilder.sessionAttr("JB4DSession", getSession());

        requestDeleteBuilder.param("recordId",recordId2);
        result = mockMvc.perform(requestDeleteBuilder).andReturn();
        json = result.getResponse().getContentAsString();
        responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());
    }
}
