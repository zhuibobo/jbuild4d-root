package com.jbuild4d.web.mybatis;

import com.jbuild4d.base.dbaccess.dbentities.MenuEntity;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.SystemBeansConfig;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes= {MybatisBeansConfig.class,SystemBeansConfig.class})
public class testcrud {

    @Autowired
    private IMenuService menuService;

    @Before
    public void before() {
        System.out.println("@Before");
    }

    @Test
    public void crudSimple(){
        String key= UUID.randomUUID().toString();
        addSingle(key);
        MenuEntity dbDemoEntity=menuService.getByPrimaryKey(key);
        Assert.assertEquals(key,dbDemoEntity.getMenuId());
        //update
        dbDemoEntity.setMenuText("update_demo1");
        menuService.updateByKey(dbDemoEntity);
        dbDemoEntity=menuService.getByPrimaryKey(key);
        Assert.assertEquals("update_demo1",dbDemoEntity.getMenuText());
        //demo2Service.deleteAll();
        List<MenuEntity> menuEntityList=menuService.getALL();
        System.out.println(menuEntityList.size());
    }

    private String addSingle(String key) {
        MenuEntity demoEntity=new MenuEntity();
        demoEntity.setMenuId(key);
        demoEntity.setMenuText("");
        demoEntity.setOrganId("1");
        demoEntity.setParentId("1");
        demoEntity.setParentIdList("1");
        demoEntity.setMenuType("1");
        demoEntity.setChildCount(1l);
        menuService.add(demoEntity);
        return key;
    }
}
