package com.jbuild4d.test.web.platform.rest.sso.organ;

import com.jbuild4d.base.dbaccess.dbentities.sso.DepartmentEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.core.base.tools.DateUtility;
import com.jbuild4d.base.tools.JsonUtility;
import com.jbuild4d.platform.sso.service.IDepartmentUserService;
import com.jbuild4d.platform.sso.service1.vo.DepartmentUserVo;
import com.jbuild4d.test.web.platform.RestTestBase;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.io.BufferedInputStream;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/26
 * To change this template use File | Settings | File Templates.
 */
public class OrganRestResourceTest extends RestTestBase {

    @Test
    public void addOrganAndDepartmentAndUserTest() throws Exception {
        for (int i=1;i<11;i++) {
            String organIdL1="Root_"+i;
            DeleteOrgan(organIdL1);
            NewOrgan(organIdL1,"0","Logo_"+i+".png");
            for(int j=1;j<11;j++) {
                String organIdL2 = organIdL1 + "_" + j;
                DeleteOrgan(organIdL2);
                NewOrgan(organIdL2, organIdL1, "Logo_" + j + ".png");
            }
        }
    }

    private void DeleteOrgan(String organId) throws Exception {
        Map<String,String> paras=new HashMap<>();
        paras.put("warningOperationCode", JBuild4DProp.getWarningOperationCode());
        paras.put("organId", organId);
        JBuild4DResponseVo responseVo =simpleDelete("/PlatFormRest/SSO/Organ/DeleteByOrganId.do",organId,paras);
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


        //获取根部门
        Map<String,String> paras=new HashMap<>();
        paras.put("organId", organId);
        JBuild4DResponseVo departmentVo=simpleGetData("/PlatFormRest/SSO/Department/GetOrganRootDepartment",paras);
        String rootDepartmentId=((LinkedHashMap) departmentVo.getData()).get("deptId").toString();
        for (int i=1;i<4;i++) {
            String deptIdL1="Dept_1_"+i+"_ORG="+organId;
            DeleteDepartment(deptIdL1);
            NewDepartment(deptIdL1,rootDepartmentId,organId);
            for(int j=1;j<4;j++) {
                String deptIdL2 = "Dept_"+i+"_"+j+"_"+organId;
                DeleteDepartment(deptIdL2);
                NewDepartment(deptIdL2, deptIdL1, organId);
            }
        }
    }

    private void DeleteDepartment(String departmentId) throws Exception {
        Map<String,String> paras=new HashMap<>();
        paras.put("warningOperationCode", JBuild4DProp.getWarningOperationCode());
        paras.put("departmentId", departmentId);
        JBuild4DResponseVo responseVo =simpleDelete("/PlatFormRest/SSO/Department/DeleteByDepartmentId.do",departmentId,paras);
    }

    private void NewDepartment(String deptId,String parentId,String organId) throws Exception {
        DepartmentEntity departmentEntity=new DepartmentEntity();
        departmentEntity.setDeptId(deptId);
        departmentEntity.setDeptName(deptId);
        departmentEntity.setDeptShortName(deptId);
        departmentEntity.setDeptNo(deptId);
        departmentEntity.setDeptPerCharge("PerCharge");
        departmentEntity.setDeptPerChargePhone("PerChargePhone");
        departmentEntity.setDeptIsVirtual(TrueFalseEnum.False.getDisplayName());
        departmentEntity.setDeptParentId(parentId);
        departmentEntity.setDeptStatus(EnableTypeEnum.enable.getDisplayName());
        departmentEntity.setDeptOrganId(organId);
        departmentEntity.setDeptDesc("DeptDesc");
        JBuild4DResponseVo responseVo=simpleSaveEdit("/PlatFormRest/SSO/Department/SaveEdit.do",departmentEntity);
        Assert.assertTrue(responseVo.isSuccess());

        for(int i=0;i<4;i++) {
            NewDepartmentUser(deptId, deptId + "_UserName_" + i + DateUtility.getDate_yyyyMMddHHmmssSSS(), deptId + "_Account_" + i + DateUtility.getDate_yyyyMMddHHmmssSSS());
        }
    }

    @Autowired
    IDepartmentUserService departmentUserService;
    private void NewDepartmentUser(String departmentId,String userName,String account) throws Exception {
        //DepartmentUserVo departmentUserVo=simpleGetData("/PlatFormRest/SSO/Department",)
        DepartmentUserVo newDepartmentUserVo=departmentUserService.getEmptyNewVo(null,departmentId);
        newDepartmentUserVo.getUserEntity().setUserAccount(account);
        newDepartmentUserVo.getUserEntity().setUserName(userName);
        newDepartmentUserVo.getUserEntity().setUserPhoneNumber("13927425407");
        newDepartmentUserVo.getDepartmentUserEntity().setDuTitle("清洁工");
        JBuild4DResponseVo responseVo=simpleSaveEdit("/PlatFormRest/SSO/DepartmentUser/SaveEdit.do",newDepartmentUserVo);
        System.out.println(responseVo.getMessage());
        Assert.assertTrue(responseVo.isSuccess());
    }
}
