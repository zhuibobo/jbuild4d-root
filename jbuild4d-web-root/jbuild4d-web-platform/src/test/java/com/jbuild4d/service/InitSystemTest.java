package com.jbuild4d.service;

import com.jbuild4d.base.dbaccess.dbentities.MenuEntity;
import com.jbuild4d.base.dbaccess.exenum.MenuTypeEnum;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.SystemBeansConfig;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/17
 * To change this template use File | Settings | File Templates.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes= {MybatisBeansConfig.class,SystemBeansConfig.class})
public class InitSystemTest {
    @Autowired
    private IMenuService menuService;

    @Test
    public void initMenu() throws JBuild4DGenerallyException {
        MenuEntity menuEntity=new MenuEntity();
        String rootId="0";
        //根菜单
        menuEntity.setMenuId(rootId);
        menuEntity.setMenuName("Root");
        menuEntity.setMenuText("Root");
        menuEntity.setMenuValue("Root");
        menuEntity.setMenuType(MenuTypeEnum.Root.getDisplayName());
        menuEntity.setIsExpand(1l);
        //menuEntity.setIsExpand();
    }
}
