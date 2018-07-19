package com.jbuild4d.service;

import com.jbuild4d.base.dbaccess.dbentities.MenuEntity;
import com.jbuild4d.base.dbaccess.exenum.MenuTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.SystemBeansConfig;
import org.junit.Before;
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
public class InitSystemTest extends BaseTest {
    @Autowired
    private IMenuService menuService;

    @Test
    public void initMenu() throws JBuild4DGenerallyException {

        //根菜单
        String rootId="0";
        MenuEntity rootMenu=getMenu("-1",rootId,"Root","Root","Root",MenuTypeEnum.Root.getDisplayName(),"","","");
        menuService.deleteByKey(jb4DSession,rootId);
        menuService.saveBySelective(jb4DSession,rootMenu.getMenuId(),rootMenu);

        //第一层节点
        //根菜单->系统设置分组
        String systemSettingId="JB4DSystemSettingRoot";
        MenuEntity systemSettingMenu=getMenu(rootMenu.getMenuId(),systemSettingId,"系统设置","系统设置","系统设置",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"LeftMenu.do","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,systemSettingId);
        menuService.saveBySelective(jb4DSession,systemSettingMenu.getMenuId(),systemSettingMenu);

        //根菜单->系统设置分组->数据字典分组
        String systemSettingDictionaryManagerId="JB4DSystemSettingDictionaryManager";
        MenuEntity systemSettingDictionaryGroupMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingDictionaryManagerId,"数据字典","数据字典","数据字典",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/Dictionary/DictionaryManager.do","");
        menuService.deleteByKey(jb4DSession,systemSettingDictionaryManagerId);
        menuService.saveBySelective(jb4DSession,systemSettingDictionaryGroupMenu.getMenuId(),systemSettingDictionaryGroupMenu);


    }

    public MenuEntity getMenu(String parentId,String id,String name,String text,String value,String type,String leftUrl,String rightUrl,String iconClassName){
        MenuEntity menuEntity=new MenuEntity();
        menuEntity.setMenuId(id);
        menuEntity.setMenuName(name);
        menuEntity.setMenuText(text);
        menuEntity.setMenuValue(value);
        menuEntity.setMenuType(type);
        menuEntity.setIsExpand(TrueFalseEnum.False.getValue());
        menuEntity.setIsSystem(TrueFalseEnum.True.getValue());
        menuEntity.setLeftUrl(leftUrl);
        menuEntity.setRightUrl(rightUrl);
        menuEntity.setParentId(parentId);
        menuEntity.setIconClassName(iconClassName);
        return menuEntity;
    }
}
