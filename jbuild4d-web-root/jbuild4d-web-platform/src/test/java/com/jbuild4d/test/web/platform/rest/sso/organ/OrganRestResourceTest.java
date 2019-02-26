package com.jbuild4d.test.web.platform.rest.sso.organ;

import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.test.web.platform.RestTestBase;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.apache.commons.io.IOUtils;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.io.BufferedInputStream;
import java.io.InputStream;
import java.util.LinkedHashMap;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/26
 * To change this template use File | Settings | File Templates.
 */
public class OrganRestResourceTest extends RestTestBase {

    @Test
    public void addOrganNotDeleteTest() throws Exception {
        /*InputStream is = this.getClass().getResourceAsStream("/OrganLogo/Logo_1.png");
        byte[] defaultImageByte = IOUtils.toByteArray(is);
        is.close();*/

        //System.out.println(responseVo.getData());

        //return responseVo;
        for (int i=1;i<11;i++) {
            String organIdL1="Root_"+i;
            NewOrgan(organIdL1,"0","Logo_"+i+".png");

            for(int j=1;j<11;j++) {
                String organIdL2 = organIdL1 + "_" + j;
                NewOrgan(organIdL2, organIdL1, "Logo_" + j + ".png");
            }
        }
    }

    private void NewOrgan(String organId,String parentId,String logoFileName) throws Exception {
        OrganEntity organEntity=new OrganEntity();
        organEntity.setOrganParentId(parentId);
        //String organId="Root_"+i;
        organEntity.setOrganId(organId);
        organEntity.setOrganName(organId);
        organEntity.setOrganShortName(organId);
        organEntity.setOrganIsVirtual("否");
        organEntity.setOrganStatus(EnableTypeEnum.enable.getDisplayName());

        BufferedInputStream fi1= (BufferedInputStream) this.getClass().getResourceAsStream("/OrganLogo/"+logoFileName);
        MockMultipartFile fstmp = new MockMultipartFile("file", "logo.jpg", "multipart/form-data",fi1);
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.multipart("/PlatFormRest/SSO/Organ/UploadOrganLogo.do")
                .file(fstmp).sessionAttr("JB4DSession",getSession())
                .param("name","OrganLogo")).andReturn();
        String json = result.getResponse().getContentAsString();
        JBuild4DResponseVo responseVo = JsonUtility.toObject(json, JBuild4DResponseVo.class);
        String logoFileId=((LinkedHashMap) responseVo.getData()).get("fileId").toString();
        organEntity.setOrganMainImageId(logoFileId);
        responseVo=simpleSaveEdit("/PlatFormRest/SSO/Organ/SaveEdit.do",organEntity);
        Assert.assertTrue(responseVo.isSuccess());
    }
}
