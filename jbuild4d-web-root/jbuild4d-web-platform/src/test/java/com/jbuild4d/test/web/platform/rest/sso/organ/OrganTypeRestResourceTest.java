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
        String recordId1= UUIDUtility.getUUID();

        String saveOrganTypeUrl = "/PlatFormRest/SSO/OrganType/SaveEdit.do";
        //新加一条记录
        String organValue="TypeTest0001";
        OrganTypeEntity organTypeEntity1=new OrganTypeEntity();
        organTypeEntity1.setOrganTypeId(recordId1);
        organTypeEntity1.setOrganTypeValue(organValue);
        organTypeEntity1.setOrganTypeName(organValue);
        organTypeEntity1.setOrganTypeDesc("");
        JBuild4DResponseVo responseVo = simpleSaveEdit(saveOrganTypeUrl,organTypeEntity1);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());

        //修改ID,重复添加一条记录相同的记录
        organTypeEntity1.setOrganTypeId(UUIDUtility.getUUID());
        responseVo = simpleSaveEdit(saveOrganTypeUrl,organTypeEntity1);
        Assert.assertEquals(OrganTypeServiceImpl.getValueExistErrorMsg(organValue),responseVo.getMessage());

        //再新加一条Value为TypeTest0002的记录,并将TypeTest0001的Value改为TypeTest0002时候,将提示错误.改为TypeTest0003时候,操作成功.
        String organValu2="TypeTest0002";
        String recordId2=UUIDUtility.getUUID();
        OrganTypeEntity organTypeEntity2=new OrganTypeEntity();
        organTypeEntity2.setOrganTypeId(recordId2);
        organTypeEntity2.setOrganTypeValue(organValu2);
        organTypeEntity2.setOrganTypeName(organValu2);
        responseVo = simpleSaveEdit(saveOrganTypeUrl,organTypeEntity2);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());

        organTypeEntity1=new OrganTypeEntity();
        organTypeEntity1.setOrganTypeId(recordId1);
        organTypeEntity1.setOrganTypeValue(organValu2);
        organTypeEntity1.setOrganTypeName(organValue);
        responseVo = simpleSaveEdit(saveOrganTypeUrl,organTypeEntity1);
        Assert.assertEquals(OrganTypeServiceImpl.getValueExistErrorMsg(organValu2),responseVo.getMessage());

        organTypeEntity1.setOrganTypeValue("TypeTest0003");
        responseVo = simpleSaveEdit(saveOrganTypeUrl,organTypeEntity1);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());
        //清空测试数据

        responseVo=simpleDelete("/PlatFormRest/SSO/OrganType/Delete.do",recordId1);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());

        responseVo=simpleDelete("/PlatFormRest/SSO/OrganType/Delete.do",recordId2);
        Assert.assertTrue(responseVo.getMessage(),responseVo.isSuccess());
    }
}
