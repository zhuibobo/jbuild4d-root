package com.jbuild4d.service;

import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.dbaccess.dbentities.MenuEntity;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.SystemBeansConfig;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.UUID;

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
        String key= UUID.randomUUID().toString();
        this.addSingle(key,key,key);
    }

    private void addSingle(String key,String text,String value) throws JBuild4DGenerallyException {
        DictionaryGroupEntity groupEntity=new DictionaryGroupEntity();
        groupEntity.setDictGroupId(key);
        groupEntity.setDictGroupText(text);
        groupEntity.setDictGroupValue(value);
        dictionaryGroupService.saveBySelective(key,groupEntity);
    }
}
