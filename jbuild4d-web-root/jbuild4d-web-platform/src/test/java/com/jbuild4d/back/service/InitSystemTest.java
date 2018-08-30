package com.jbuild4d.back.service;

import com.jbuild4d.base.dbaccess.dbentities.builder.MenuEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.system.devdemo.IDevDemoGenListService;
import com.jbuild4d.platform.system.devdemo.IDevDemoTreeTableService;
import com.jbuild4d.platform.system.service.*;
import com.jbuild4d.web.platform.beanconfig.jdbctemplate.JdbcTemplateBeansConfig;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.BuilderBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.DevDemoBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.OrganBeansConfig;
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
@ContextConfiguration(classes= {
        MybatisBeansConfig.class,
        SystemBeansConfig.class,
        DevDemoBeansConfig.class,
        OrganBeansConfig.class,
        BuilderBeansConfig.class,
        JdbcTemplateBeansConfig.class
})
public class InitSystemTest extends BaseTest {
    @Autowired
    private IMenuService menuService;

    @Autowired
    private IDictionaryGroupService dictionaryGroupService;

    @Autowired
    private IDevDemoGenListService devDemoGenListService;

    @Autowired
    private IDevDemoTreeTableService devDemoTreeTableService;



    @Autowired
    private IDictionaryService dictionaryService;





    @Test
    public void initSystem() throws JBuild4DGenerallyException {



        /*//根菜单
        String rootMenuId="0";
        MenuEntity rootMenu=getMenu("-1",rootMenuId,"Root","Root","Root",MenuTypeEnum.Root.getDisplayName(),"","","");
        menuService.deleteByKey(jb4DSession,rootMenu.getMenuId());
        menuService.save(jb4DSession,rootMenu.getMenuId(),rootMenu);

        //根菜单->系统设置分组
        String systemSettingRootId="JB4DSystemSettingRoot";
        MenuEntity systemSettingMenu=getMenu(rootMenu.getMenuId(),systemSettingRootId,"系统设置","系统设置","系统设置",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/LeftMenu","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,systemSettingMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingMenu.getMenuId(),systemSettingMenu);

        //根菜单->系统设置分组->数据字典分组
        String systemSettingDictionaryManagerId="JB4DSystemSettingDictionaryManager";
        MenuEntity systemSettingDictionaryGroupMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingDictionaryManagerId,"数据字典","数据字典","数据字典",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/Dictionary/DictionaryManager","");
        menuService.deleteByKey(jb4DSession,systemSettingDictionaryGroupMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingDictionaryGroupMenu.getMenuId(),systemSettingDictionaryGroupMenu);

        //根菜单->系统设置分组->操作日志
        String systemSettingOperationLogId="JB4DSystemSettingOperationLog";
        MenuEntity systemSettingOperationLogMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingOperationLogId,"操作日志","操作日志","操作日志",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/OperationLog/ListView","");
        menuService.deleteByKey(jb4DSession,systemSettingOperationLogMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingOperationLogMenu.getMenuId(),systemSettingOperationLogMenu);

        //根菜单->系统设置分组->参数设置
        String systemSettingParasSettingId="JB4DSystemSettingParasSetting";
        MenuEntity systemSettingParasSettingMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingParasSettingId,"参数设置","参数设置","参数设置",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/ParasSetting/ListView","");
        menuService.deleteByKey(jb4DSession,systemSettingParasSettingMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingParasSettingMenu.getMenuId(),systemSettingParasSettingMenu);

        //根菜单->系统设置分组->代码生成
        String systemSettingCodeGenerateId="JB4DSystemSettingCodeGenerate";
        MenuEntity systemSettingCodeGenerateMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingCodeGenerateId,"代码生成","代码生成","代码生成",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/CodeGenerate/Manager","");
        menuService.deleteByKey(jb4DSession,systemSettingCodeGenerateMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingCodeGenerateMenu.getMenuId(),systemSettingCodeGenerateMenu);

        //根菜单->系统设置分组->组织管理
        String systemSettingOrganManageId="JB4DSystemSettingOrganManage";
        MenuEntity systemSettingOrganManageMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingOrganManageId,"组织管理","组织管理","组织管理",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/OrganRelevance/Organ/ListView","");
        menuService.deleteByKey(jb4DSession,systemSettingOrganManageMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingOrganManageMenu.getMenuId(),systemSettingOrganManageMenu);


        //根菜单->开发示例
        String devDemoRootId="JB4DDevDemoRoot";
        MenuEntity devDemoRootMenu=getMenu(rootMenu.getMenuId(),devDemoRootId,"开发示例","开发示例","开发示例",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/PlatForm/devdemo/Menus","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,devDemoRootId);
        menuService.save(jb4DSession,devDemoRootMenu.getMenuId(),devDemoRootMenu);

        //根菜单->应用设计
        String appBuilderRootId="JB4DSystemAppBuilderRoot";
        MenuEntity appBuilderRootMenu=getMenu(rootMenu.getMenuId(),appBuilderRootId,"应用设计","应用设计","应用设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/LeftMenu","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,appBuilderRootMenu.getMenuId());
        menuService.save(jb4DSession,appBuilderRootMenu.getMenuId(),appBuilderRootMenu);

        //根菜单->应用管理->存储设计
        String appBuilderDataStorageBuilderId="JB4DSystemAppBuilderDataStorageBuilder";
        MenuEntity appManagerDataStorageMenu=getMenu(appBuilderRootMenu.getMenuId(),appBuilderDataStorageBuilderId,"存储设计","存储设计","存储设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/LeftMenu","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,appManagerDataStorageMenu.getMenuId());
        menuService.save(jb4DSession,appManagerDataStorageMenu.getMenuId(),appManagerDataStorageMenu);


        //根菜单->应用管理->存储设计->服务链接
        String appBuilderDataLinkId="JB4DSystemAppBuilderDataLink";
        MenuEntity appBuilderDataLinkMenu=getMenu(appManagerDataStorageMenu.getMenuId(),appBuilderDataLinkId,"服务链接","服务链接","服务链接",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"","/PlatForm/Builder/DataStorage/DataLink/ListView","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,appBuilderDataLinkMenu.getMenuId());
        //menuService.save(jb4DSession,appBuilderDataLinkMenu.getMenuId(),appBuilderDataLinkMenu);

        //根菜单->应用管理->存储设计->数据库管理
        String appBuilderDataBaseId="JB4DSystemAppBuilderDataBase";
        MenuEntity appBuilderDataBaseMenu=getMenu(appManagerDataStorageMenu.getMenuId(),appBuilderDataBaseId,"数据库管理","数据库管理","数据库管理",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"","/PlatForm/Builder/DataStorage/DataBase/TableGroup/ListView","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,appBuilderDataBaseMenu.getMenuId());
        menuService.save(jb4DSession,appBuilderDataBaseMenu.getMenuId(),appBuilderDataBaseMenu);

        //根菜单->应用管理->存储设计->数据关系
        String appBuilderDataRelationId="JB4DSystemAppBuilderDataRelation";
        MenuEntity appBuilderDataRelationMenu=getMenu(appManagerDataStorageMenu.getMenuId(),appBuilderDataRelationId,"数据关系","数据关系","数据关系",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/LeftMenu","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,appBuilderDataRelationMenu.getMenuId());
        menuService.save(jb4DSession,appBuilderDataRelationMenu.getMenuId(),appBuilderDataRelationMenu);

        //根菜单->应用管理->数据集设计
        String appBuilderDataSetId="JB4DSystemAppBuilderDataSetBuilder";
        MenuEntity appBuilderDataSetMenu=getMenu(appBuilderRootMenu.getMenuId(),appBuilderDataSetId,"数据集设计","数据集设计","数据集设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/LeftMenu","/PlatForm/Builder/DataSet/DataSetGroup/ListView","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,appBuilderDataSetMenu.getMenuId());
        menuService.save(jb4DSession,appBuilderDataSetMenu.getMenuId(),appBuilderDataSetMenu);

        //根菜单->应用管理->模块设计
        String appBuilderModuleBuilderId="JB4DSystemAppBuilderModuleBuilder";
        MenuEntity appBuilderModuleBuilderMenu=getMenu(appBuilderRootMenu.getMenuId(),appBuilderModuleBuilderId,"模块设计","模块设计","模块设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/LeftMenu","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,appBuilderModuleBuilderMenu.getMenuId());
        menuService.save(jb4DSession,appBuilderModuleBuilderMenu.getMenuId(),appBuilderModuleBuilderMenu);

        //根菜单->应用管理->菜单设计
        String appBuilderMenuBuilderId="JB4DSystemAppBuilderMenuBuilder";
        MenuEntity appBuilderMenuBuilderMenu=getMenu(appBuilderRootMenu.getMenuId(),appBuilderMenuBuilderId,"菜单设计","菜单设计","菜单设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/LeftMenu","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,appBuilderMenuBuilderMenu.getMenuId());
        menuService.save(jb4DSession,appBuilderMenuBuilderMenu.getMenuId(),appBuilderMenuBuilderMenu);*/



        //生成开发示例中使用到的数据字典项
        /**/


        //测试数据
        /*devDemoGenListService.deleteAll(jb4DSession);
        for(int i=0;i<20;i++){
            DevDemoGenListEntity ddglEntity=new DevDemoGenListEntity();
            ddglEntity.setDdglId(UUIDUtility.getUUID());
            ddglEntity.setDdglKey("key"+i);
            ddglEntity.setDdglName("name"+i);
            ddglEntity.setDdglValue("value"+i);
            ddglEntity.setDdglBindDicSelected("Select-Value-"+i);
            ddglEntity.setDdglBindDicRadio("Radio-Value-"+i);
            ddglEntity.setDdglBindDicCheckbox1("1");
            ddglEntity.setDdglBindDicCheckbox2("1");
            ddglEntity.setDdglBindDicCheckbox3("0");
            if(i<=10) {
                ddglEntity.setDdglBindDicMucheckbox("Checkbox-Value-0;Checkbox-Value-"+i);
            }
            devDemoGenListService.save(jb4DSession,ddglEntity.getDdglId(),ddglEntity);
        }*/

        //DevDemoTreeTable根节点



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
