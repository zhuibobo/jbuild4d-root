package com.jbuild4d.service;

import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.SystemBeansConfig;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/11
 * To change this template use File | Settings | File Templates.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes= {MybatisBeansConfig.class,SystemBeansConfig.class})
public class DictionaryGroupServiceTest {

    @Autowired
    private IDictionaryGroupService dictionaryGroupService;

    @Test
    public void crudSimple() throws JBuild4DGenerallyException {
        //String key= UUID.randomUUID().toString();
        //this.addSingle(key,key,key);
        //DictionaryGroupEntity newEntity=dictionaryGroupService.getByPrimaryKey(key);
        //Assert.assertEquals(key,newEntity.getDictGroupText());
        //dictionaryGroupService.moveUp("3ef083a7-eee9-4e55-b38c-215bbe11fc2c");

        List<String> keys=new ArrayList<>();
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        int nextMaxOrderNum=dictionaryGroupService.getNextOrderNum(jb4DSession);
        try {
            for (int i = 0; i < 100; i++) {
                String key = UUIDUtility.getTestUUID();
                Assert.assertTrue(key.indexOf(UUIDUtility.getTestPrefix())==0);
                this.addSingle(key, key, key);
                keys.add(key);
                DictionaryGroupEntity newEntity = dictionaryGroupService.getByPrimaryKey(jb4DSession,key);
                Assert.assertEquals(key, newEntity.getDictGroupText());
                Assert.assertEquals(nextMaxOrderNum + i, Integer.parseInt(newEntity.getDictGroupOrderNum().toString()));
            }

            //测试升序，降序


            for (String key : keys) {
                dictionaryGroupService.deleteByKey(jb4DSession,key);
            }

            DictionaryGroupEntity entity = dictionaryGroupService.getByPrimaryKey(jb4DSession,keys.get(0));
            Assert.assertEquals(null, entity);
        }
        finally {
            for (String key : keys) {
                dictionaryGroupService.deleteByKey(jb4DSession,key);
            }
        }
    }

    private void addSingle(String key,String text,String value) throws JBuild4DGenerallyException {
        DictionaryGroupEntity groupEntity=new DictionaryGroupEntity();
        groupEntity.setDictGroupId(key);
        groupEntity.setDictGroupText(text);
        groupEntity.setDictGroupValue(value);
        groupEntity.setDictGroupCreateTime(new Date());
        groupEntity.setDictGroupDesc("");
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        dictionaryGroupService.save(jb4DSession,key,groupEntity);
    }
}
