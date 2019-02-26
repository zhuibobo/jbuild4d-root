package com.jbuild4d.test.web.platform.rest.sso.organ;

import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.test.web.platform.RestTestBase;
import org.junit.Test;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/26
 * To change this template use File | Settings | File Templates.
 */
public class OrganRestResourceTest extends RestTestBase {

    @Test
    public void addOrganNotDeleteTest() throws Exception {
        for (int i=1;i<11;i++) {
            OrganEntity organEntity=new OrganEntity();
            organEntity.setOrganParentId("0");

            simpleSaveEdit("/PlatFormRest/SSO/Organ/SaveEdit.do",organEntity);
        }
    }
}
