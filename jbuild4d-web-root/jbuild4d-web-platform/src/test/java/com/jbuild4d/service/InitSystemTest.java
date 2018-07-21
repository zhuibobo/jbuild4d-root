package com.jbuild4d.service;

import com.jbuild4d.base.dbaccess.dbentities.DevDemoGenListEntity;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.dbaccess.dbentities.MenuEntity;
import com.jbuild4d.base.dbaccess.exenum.MenuTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.system.service.IDevDemoGenListService;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.DevDemoBeansConfig;
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
@ContextConfiguration(classes= {MybatisBeansConfig.class,SystemBeansConfig.class, DevDemoBeansConfig.class})
public class InitSystemTest extends BaseTest {
    @Autowired
    private IMenuService menuService;

    @Autowired
    private IDictionaryGroupService dictionaryGroupService;


    @Autowired
    private IDevDemoGenListService devDemoGenListService;

    @Test
    public void initSystem() throws JBuild4DGenerallyException {

        //根菜单
        String rootMenuId="0";
        MenuEntity rootMenu=getMenu("-1",rootMenuId,"Root","Root","Root",MenuTypeEnum.Root.getDisplayName(),"","","");
        menuService.deleteByKey(jb4DSession,rootMenuId);
        menuService.saveBySelective(jb4DSession,rootMenu.getMenuId(),rootMenu);

        //根菜单->系统设置分组
        String systemSettingRootId="JB4DSystemSettingRoot";
        MenuEntity systemSettingMenu=getMenu(rootMenu.getMenuId(),systemSettingRootId,"系统设置","系统设置","系统设置",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"LeftMenu.do","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,systemSettingRootId);
        menuService.saveBySelective(jb4DSession,systemSettingMenu.getMenuId(),systemSettingMenu);

        //根菜单->系统设置分组->数据字典分组
        String systemSettingDictionaryManagerId="JB4DSystemSettingDictionaryManager";
        MenuEntity systemSettingDictionaryGroupMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingDictionaryManagerId,"数据字典","数据字典","数据字典",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/Dictionary/DictionaryManager.do","");
        menuService.deleteByKey(jb4DSession,systemSettingDictionaryManagerId);
        menuService.saveBySelective(jb4DSession,systemSettingDictionaryGroupMenu.getMenuId(),systemSettingDictionaryGroupMenu);

        //根菜单->系统设置分组->参数设置
        String systemSettingParasSettingId="JB4DSystemSettingParasSetting";
        MenuEntity systemSettingParasSettingMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingParasSettingId,"参数设置","参数设置","参数设置",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/Dictionary/DictionaryManager.do","");
        menuService.deleteByKey(jb4DSession,systemSettingParasSettingId);
        menuService.saveBySelective(jb4DSession,systemSettingParasSettingMenu.getMenuId(),systemSettingParasSettingMenu);

        //根菜单->开发示例
        String devDemoRootId="JB4DDevDemoRoot";
        MenuEntity devDemoRootMenu=getMenu(rootMenu.getMenuId(),devDemoRootId,"开发示例","开发示例","开发示例",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/PlatForm/DevDemo/Menus.do","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,devDemoRootId);
        menuService.saveBySelective(jb4DSession,devDemoRootMenu.getMenuId(),devDemoRootMenu);

        //跟字典分组
        String rootDictionaryId="0";
        DictionaryGroupEntity rootDictionaryGroupEntity=getDictionaryGroup(rootDictionaryId,"数据字典分组","数据字典分组","","-1",TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        dictionaryGroupService.deleteByKeyNotValidate(jb4DSession,rootDictionaryId);
        dictionaryGroupService.saveBySelective(jb4DSession,rootDictionaryGroupEntity.getDictGroupId(),rootDictionaryGroupEntity);

        devDemoGenListService.deleteAll(jb4DSession);
        //测试数据
        for(int i=0;i<100;i++){
            DevDemoGenListEntity ddglEntity=new DevDemoGenListEntity();
            ddglEntity.setDdglId(UUIDUtility.getUUID());
            ddglEntity.setDdglKey("key"+i);
            ddglEntity.setDdglName("name"+i);
            ddglEntity.setDdglValue("value"+i);
            devDemoGenListService.saveBySelective(jb4DSession,ddglEntity.getDdglId(),ddglEntity);
        }
    }

    public DictionaryGroupEntity getDictionaryGroup(String id,String value,String text,String desc,String parendId,String isSystem,String delEnable){
        DictionaryGroupEntity dictionaryGroupEntity=new DictionaryGroupEntity();
        dictionaryGroupEntity.setDictGroupId(id);
        dictionaryGroupEntity.setDictGroupValue(value);
        dictionaryGroupEntity.setDictGroupText(text);
        dictionaryGroupEntity.setDictGroupDesc(desc);
        dictionaryGroupEntity.setDictGroupParentId(parendId);
        dictionaryGroupEntity.setDictGroupIssystem(isSystem);
        dictionaryGroupEntity.setDictGroupDelEnable(delEnable);
        return dictionaryGroupEntity;
    }

    public MenuEntity getMenu(String parentId,String id,String name,String text,String value,String type,String leftUrl,String rightUrl,String iconClassName){
        MenuEntity menuEntity=new MenuEntity();
        menuEntity.setMenuId(id);
        menuEntity.setMenuName(name);
        menuEntity.setMenuText(text);
        menuEntity.setMenuValue(value);
        menuEntity.setMenuType(type);
        menuEntity.setMenuIsExpand(TrueFalseEnum.False.getDisplayName());
        menuEntity.setMenuIsSystem(TrueFalseEnum.True.getDisplayName());
        menuEntity.setMenuLeftUrl(leftUrl);
        menuEntity.setMenuRightUrl(rightUrl);
        menuEntity.setMenuParentId(parentId);
        menuEntity.setMenuClassName(iconClassName);
        return menuEntity;
    }
}
