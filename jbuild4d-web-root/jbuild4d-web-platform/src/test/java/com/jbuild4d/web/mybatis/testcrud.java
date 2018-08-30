package com.jbuild4d.web.mybatis;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.MenuEntity;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
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
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        addSingle(key);
        MenuEntity dbDemoEntity=menuService.getByPrimaryKey(jb4DSession,key);
        Assert.assertEquals(key,dbDemoEntity.getMenuId());
        //update
        dbDemoEntity.setMenuText("update_demo1");

        menuService.updateByKey(jb4DSession,dbDemoEntity);
        dbDemoEntity=menuService.getByPrimaryKey(jb4DSession,key);
        Assert.assertEquals("update_demo1",dbDemoEntity.getMenuText());
        //demo2Service.deleteAll();
        List<MenuEntity> menuEntityList=menuService.getALL(jb4DSession);
        System.out.println(menuEntityList.size());
    }

    private String addSingle(String key) {
        MenuEntity demoEntity=new MenuEntity();
        demoEntity.setMenuId(key);
        demoEntity.setMenuText("");
        demoEntity.setMenuParentId("1");
        demoEntity.setMenuParentIdList("1");
        demoEntity.setMenuType("1");
        demoEntity.setMenuMenuChildCount(0);
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        menuService.add(jb4DSession,demoEntity);
        return key;
    }
}
