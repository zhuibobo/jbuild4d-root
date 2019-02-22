package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.builder.MenuMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.MenuEntity;
import com.jbuild4d.base.dbaccess.exenum.MenuTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.platform.system.service.IMenuService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

public class MenuServiceImpl extends BaseServiceImpl<MenuEntity> implements IMenuService {

    MenuMapper menuMapper;

    public MenuServiceImpl(MenuMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        menuMapper = _defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, MenuEntity entity) throws JBuild4DGenerallyException {
        return super.save(jb4DSession, id, entity, new IAddBefore<MenuEntity>() {
            @Override
            public MenuEntity run(JB4DSession jb4DSession, MenuEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setMenuOrganId(jb4DSession.getOrganId());
                sourceEntity.setMenuOrganName(jb4DSession.getOrganName());
                sourceEntity.setMenuUserId(jb4DSession.getUserId());
                sourceEntity.setMenuUserName(jb4DSession.getUserName());
                sourceEntity.setMenuOrderNum(menuMapper.nextOrderNum());
                MenuEntity parentEntity=null;
                if(StringUtility.isEmpty(sourceEntity.getMenuParentId())){
                    throw new JBuild4DGenerallyException("请在实体中设置ParentId的值!");
                }
                if(!sourceEntity.getMenuParentId().equals("-1")){
                    parentEntity=menuMapper.selectByPrimaryKey(sourceEntity.getMenuParentId());
                    if(parentEntity==null){
                        throw new JBuild4DGenerallyException("找不到父节点为"+sourceEntity.getMenuParentId()+"的记录!");
                    }
                    else
                    {
                        sourceEntity.setMenuParentIdList(parentEntity.getMenuParentIdList()+"*"+sourceEntity.getMenuId());
                    }
                }
                else
                {
                    sourceEntity.setMenuParentIdList("-1*"+sourceEntity.getMenuId());
                }

                sourceEntity.setMenuCreateTime(new Date());
                sourceEntity.setMenuCreator(jb4DSession.getUserName());
                sourceEntity.setMenuMenuChildCount(0);
                sourceEntity.setMenuUpdater(jb4DSession.getUserName());
                sourceEntity.setMenuUpdateTime(new Date());
                return sourceEntity;
            }
        });
    }

    @Override
    public void initSystemData(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        //根菜单
        String rootMenuId="0";
        MenuEntity rootMenu=getMenu("-1",rootMenuId,"Root","Root","Root", MenuTypeEnum.Root.getDisplayName(),"","","");
        deleteByKey(jb4DSession,rootMenu.getMenuId());
        save(jb4DSession,rootMenu.getMenuId(),rootMenu);

        //根菜单->系统设置分组
        String systemSettingRootId="JB4DSystemSettingRoot";
        MenuEntity systemSettingMenu=getMenu(rootMenu.getMenuId(),systemSettingRootId,"系统设置","系统设置","系统设置",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/LeftMenuView","","menu-data");
        deleteByKey(jb4DSession,systemSettingMenu.getMenuId());
        save(jb4DSession,systemSettingMenu.getMenuId(),systemSettingMenu);

        //根菜单->系统设置分组->数据字典分组
        String systemSettingDictionaryManagerId="JB4DSystemSettingDictionaryManager";
        MenuEntity systemSettingDictionaryGroupMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingDictionaryManagerId,"数据字典","数据字典","数据字典",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","System/Dictionary/DictionaryManagerView","");
        deleteByKey(jb4DSession,systemSettingDictionaryGroupMenu.getMenuId());
        save(jb4DSession,systemSettingDictionaryGroupMenu.getMenuId(),systemSettingDictionaryGroupMenu);

        //根菜单->系统设置分组->操作日志
        String systemSettingOperationLogId="JB4DSystemSettingOperationLog";
        MenuEntity systemSettingOperationLogMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingOperationLogId,"操作日志","操作日志","操作日志",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","System/OperationLog/ListView","");
        deleteByKey(jb4DSession,systemSettingOperationLogMenu.getMenuId());
        save(jb4DSession,systemSettingOperationLogMenu.getMenuId(),systemSettingOperationLogMenu);

        //根菜单->系统设置分组->参数设置
        String systemSettingParasSettingId="JB4DSystemSettingParasSetting";
        MenuEntity systemSettingParasSettingMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingParasSettingId,"参数设置","参数设置","参数设置",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","System/ParasSetting/ListView","");
        deleteByKey(jb4DSession,systemSettingParasSettingMenu.getMenuId());
        save(jb4DSession,systemSettingParasSettingMenu.getMenuId(),systemSettingParasSettingMenu);

        //根菜单->系统设置分组->代码生成
        String systemSettingCodeGenerateId="JB4DSystemSettingCodeGenerate";
        MenuEntity systemSettingCodeGenerateMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingCodeGenerateId,"代码生成","代码生成","代码生成",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","System/CodeGenerate/ManagerView","");
        deleteByKey(jb4DSession,systemSettingCodeGenerateMenu.getMenuId());
        save(jb4DSession,systemSettingCodeGenerateMenu.getMenuId(),systemSettingCodeGenerateMenu);

        //根菜单->系统设置分组->组织管理
        String systemSettingOrganManageId="JB4DSystemSettingOrganManage";
        MenuEntity systemSettingOrganManageMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingOrganManageId,"组织管理","组织管理","组织管理",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","OrganRelevance/Organ/ListView","");
        deleteByKey(jb4DSession,systemSettingOrganManageMenu.getMenuId());
        save(jb4DSession,systemSettingOrganManageMenu.getMenuId(),systemSettingOrganManageMenu);

        //根菜单->系统设置分组->缓存管理
        String systemSettingCacheManageId="JB4DSystemSettingCacheManage";
        MenuEntity systemSettingCacheManageMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingCacheManageId,"缓存管理","缓存管理","缓存管理",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","System/Cache/ListView","");
        deleteByKey(jb4DSession,systemSettingCacheManageMenu.getMenuId());
        save(jb4DSession,systemSettingCacheManageMenu.getMenuId(),systemSettingCacheManageMenu);


        //根菜单->开发示例
        String devDemoRootId="JB4DDevDemoRoot";
        MenuEntity devDemoRootMenu=getMenu(rootMenu.getMenuId(),devDemoRootId,"开发示例","开发示例","开发示例",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"DevDemo/MenusView","","menu-data");
        deleteByKey(jb4DSession,devDemoRootId);
        save(jb4DSession,devDemoRootMenu.getMenuId(),devDemoRootMenu);

        //根菜单->开发示例->通用列表(带查询)
        String devDemoRootId_SearchListId="JB4DDevDemoRoot_SearchList";
        MenuEntity devDemoRootMenu_SearchList=getMenu(devDemoRootMenu.getMenuId(),devDemoRootId_SearchListId,"通用列表(带查询)","通用列表(带查询)","通用列表(带查询)",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","DevDemo/DevDemoGenList/ListView","menu-data");
        deleteByKey(jb4DSession,devDemoRootId_SearchListId);
        save(jb4DSession,devDemoRootMenu_SearchList.getMenuId(),devDemoRootMenu_SearchList);
        //根菜单->开发示例->通用列表(不带查询)
        String devDemoRootId_NoSearchListId="JB4DDevDemoRoot_NoSearchList";
        MenuEntity devDemoRootMenu_NoSearchList=getMenu(devDemoRootMenu.getMenuId(),devDemoRootId_NoSearchListId,"通用列表(不带查询)","通用列表(不带查询)","通用列表(不带查询)",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","DevDemo/DevDemoGenList/ListNotSearchView","menu-data");
        deleteByKey(jb4DSession,devDemoRootId_NoSearchListId);
        save(jb4DSession,devDemoRootMenu_NoSearchList.getMenuId(),devDemoRootMenu_NoSearchList);
        //根菜单->开发示例->通用列表(绑定数据字典)
        String devDemoRootId_BindDictSearchListId="JB4DDevDemoRoot_BindDictSearchList";
        MenuEntity devDemoRootId_BindDictSearchList=getMenu(devDemoRootMenu.getMenuId(),devDemoRootId_BindDictSearchListId,"通用列表(绑定数据字典)","通用列表(绑定数据字典)","通用列表(绑定数据字典)",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","DevDemo/DevDemoGenListBindDictionary/ListView","menu-data");
        deleteByKey(jb4DSession,devDemoRootId_BindDictSearchListId);
        save(jb4DSession,devDemoRootId_BindDictSearchList.getMenuId(),devDemoRootId_BindDictSearchList);
        //根菜单->开发示例->通用列表(弹出列表)
        String devDemoRootId_DialogSearchListId="JB4DDevDemoRoot_DialogSearchList";
        MenuEntity devDemoRootId_DialogSearchList=getMenu(devDemoRootMenu.getMenuId(),devDemoRootId_DialogSearchListId,"通用列表(弹出列表)","通用列表(弹出列表)","通用列表(弹出列表)",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","DevDemo/DevDemoGenList/ListView","menu-data");
        deleteByKey(jb4DSession,devDemoRootId_DialogSearchListId);
        save(jb4DSession,devDemoRootId_DialogSearchList.getMenuId(),devDemoRootId_DialogSearchList);
        //根菜单->开发示例->树形表格
        String devDemoRootId_TreeTableId="devDemoRootId_TreeTable";
        MenuEntity devDemoRootId_TreeTable=getMenu(devDemoRootMenu.getMenuId(),devDemoRootId_TreeTableId,"树形表格","树形表格","树形表格",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","DevDemo/DevDemoTreeTable/ListView","menu-data");
        deleteByKey(jb4DSession,devDemoRootId_TreeTableId);
        save(jb4DSession,devDemoRootId_TreeTable.getMenuId(),devDemoRootId_TreeTable);
        //根菜单->开发示例->树与列表
        String devDemoRootId_TreeAndListId="devDemoRootId_TreeList";
        MenuEntity devDemoRootId_TreeAndList=getMenu(devDemoRootMenu.getMenuId(),devDemoRootId_TreeAndListId,"树与列表","树与列表","树与列表",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","DevDemo/TreeAndList/DevDemoTLTree/ListView","menu-data");
        deleteByKey(jb4DSession,devDemoRootId_TreeAndListId);
        save(jb4DSession,devDemoRootId_TreeAndList.getMenuId(),devDemoRootId_TreeAndList);

        //根菜单->应用设计
        String appBuilderRootId="JB4DSystemAppBuilderRoot";
        MenuEntity appBuilderRootMenu=getMenu(rootMenu.getMenuId(),appBuilderRootId,"应用设计","应用设计","应用设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/LeftMenuView","","menu-data");
        deleteByKey(jb4DSession,appBuilderRootMenu.getMenuId());
        save(jb4DSession,appBuilderRootMenu.getMenuId(),appBuilderRootMenu);

        //根菜单->应用管理->存储设计
        String appBuilderDataStorageBuilderId="JB4DSystemAppBuilderDataStorageBuilder";
        MenuEntity appManagerDataStorageMenu=getMenu(appBuilderRootMenu.getMenuId(),appBuilderDataStorageBuilderId,"存储设计","存储设计","存储设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/LeftMenuView","","top-menu-data");
        deleteByKey(jb4DSession,appManagerDataStorageMenu.getMenuId());
        save(jb4DSession,appManagerDataStorageMenu.getMenuId(),appManagerDataStorageMenu);


        //根菜单->应用管理->存储设计->服务链接
        String appBuilderDataLinkId="JB4DSystemAppBuilderDataLink";
        MenuEntity appBuilderDataLinkMenu=getMenu(appManagerDataStorageMenu.getMenuId(),appBuilderDataLinkId,"服务链接","服务链接","服务链接",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"","Builder/DataStorage/DataLink/ListView","frame-top-menu-data");
        deleteByKey(jb4DSession,appBuilderDataLinkMenu.getMenuId());
        //menuService.save(jb4DSession,appBuilderDataLinkMenu.getMenuId(),appBuilderDataLinkMenu);

        //根菜单->应用管理->存储设计->数据库管理
        String appBuilderDataBaseId="JB4DSystemAppBuilderDataBase";
        MenuEntity appBuilderDataBaseMenu=getMenu(appManagerDataStorageMenu.getMenuId(),appBuilderDataBaseId,"数据库管理","数据库管理","数据库管理",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"","Builder/DataStorage/DataBase/TableGroup/ListView","frame-top-menu-data");
        deleteByKey(jb4DSession,appBuilderDataBaseMenu.getMenuId());
        save(jb4DSession,appBuilderDataBaseMenu.getMenuId(),appBuilderDataBaseMenu);

        //根菜单->应用管理->存储设计->数据关系
        String appBuilderDataRelationId="JB4DSystemAppBuilderDataRelation";
        MenuEntity appBuilderDataRelationMenu=getMenu(appManagerDataStorageMenu.getMenuId(),appBuilderDataRelationId,"数据关系","数据关系","数据关系",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"","","frame-top-menu-data");
        deleteByKey(jb4DSession,appBuilderDataRelationMenu.getMenuId());
        save(jb4DSession,appBuilderDataRelationMenu.getMenuId(),appBuilderDataRelationMenu);

        //根菜单->应用管理->数据集设计
        String appBuilderDataSetId="JB4DSystemAppBuilderDataSetBuilder";
        MenuEntity appBuilderDataSetMenu=getMenu(appBuilderRootMenu.getMenuId(),appBuilderDataSetId,"数据集设计","数据集设计","数据集设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"","Builder/DataSet/DataSetGroup/ListView","frame-top-menu-data");
        deleteByKey(jb4DSession,appBuilderDataSetMenu.getMenuId());
        save(jb4DSession,appBuilderDataSetMenu.getMenuId(),appBuilderDataSetMenu);

        //根菜单->应用管理->模块设计
        String appBuilderModuleBuilderId="JB4DSystemAppBuilderModuleBuilder";
        MenuEntity appBuilderModuleBuilderMenu=getMenu(appBuilderRootMenu.getMenuId(),appBuilderModuleBuilderId,"模块设计","模块设计","模块设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"","Builder/Module/ListView","frame-top-menu-data");
        deleteByKey(jb4DSession,appBuilderModuleBuilderMenu.getMenuId());
        save(jb4DSession,appBuilderModuleBuilderMenu.getMenuId(),appBuilderModuleBuilderMenu);

        //根菜单->应用管理->菜单设计
        String appBuilderMenuBuilderId="JB4DSystemAppBuilderMenuBuilder";
        MenuEntity appBuilderMenuBuilderMenu=getMenu(appBuilderRootMenu.getMenuId(),appBuilderMenuBuilderId,"菜单设计","菜单设计","菜单设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"","","frame-top-menu-data");
        deleteByKey(jb4DSession,appBuilderMenuBuilderMenu.getMenuId());
        save(jb4DSession,appBuilderMenuBuilderMenu.getMenuId(),appBuilderMenuBuilderMenu);

        //根菜单->应用管理->流程设计
        String appBuilderFlowBuilderId="JB4DSystemAppBuilderFlowBuilder";
        MenuEntity appBuilderFlowBuilderMenu=getMenu(appBuilderRootMenu.getMenuId(),appBuilderFlowBuilderId,"流程设计","流程设计","流程设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"","","frame-top-menu-data");
        deleteByKey(jb4DSession,appBuilderFlowBuilderMenu.getMenuId());
        save(jb4DSession,appBuilderFlowBuilderMenu.getMenuId(),appBuilderFlowBuilderMenu);

        //根菜单->应用管理->桌面设计
        String appBuilderDesktopBuilderId="JB4DSystemAppBuilderDesktopBuilder";
        MenuEntity appBuilderDesktopBuilderMenu=getMenu(appBuilderRootMenu.getMenuId(),appBuilderDesktopBuilderId,"桌面设计","桌面设计","桌面设计",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"","","frame-top-menu-data");
        deleteByKey(jb4DSession,appBuilderDesktopBuilderMenu.getMenuId());
        save(jb4DSession,appBuilderDesktopBuilderMenu.getMenuId(),appBuilderDesktopBuilderMenu);
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
