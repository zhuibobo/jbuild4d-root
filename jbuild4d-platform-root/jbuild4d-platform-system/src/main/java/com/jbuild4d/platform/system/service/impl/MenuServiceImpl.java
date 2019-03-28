package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.builder.MenuMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.MenuEntity;
import com.jbuild4d.base.dbaccess.exenum.MenuTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.tools.StringUtility;
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
    public int saveSimple(JB4DSession jb4DSession, String id, MenuEntity entity) throws JBuild4DGenerallyException {
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

    private MenuEntity createMenu(JB4DSession jb4DSession,String parentId,String menuId,String name,String text,String value,String rightUrl,String iconClassName) throws JBuild4DGenerallyException {
        //String systemSettingCacheManageId="JB4DSystemSettingCacheManage";
        MenuEntity newMenu=getMenu(parentId,menuId,name,text,value,
                MenuTypeEnum.LeftMenu.getDisplayName(),"",rightUrl,iconClassName);
        deleteByKey(jb4DSession,newMenu.getMenuId());
        saveSimple(jb4DSession,newMenu.getMenuId(),newMenu);
        return newMenu;
    }

    @Override
    public void initSystemData(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        //根菜单
        String rootMenuId="0";
        MenuEntity rootMenu=getMenu("-1",rootMenuId,"Root","Root","Root", MenuTypeEnum.Root.getDisplayName(),"","","");
        deleteByKey(jb4DSession,rootMenu.getMenuId());
        saveSimple(jb4DSession,rootMenu.getMenuId(),rootMenu);

        //根菜单->开发示例
        MenuEntity devDemoRootMenu=createMenu(jb4DSession,rootMenu.getMenuId(),"JB4DDevDemoRoot",
                "开发示例","开发示例","开发示例",
                "","");

        //根菜单->开发示例->通用列表(带查询)
        MenuEntity devDemoRootMenu_SearchList=createMenu(jb4DSession,devDemoRootMenu.getMenuId(),"JB4DDevDemoRoot_SearchList",
                "通用列表(带查询)","通用列表(带查询)","通用列表(带查询)",
                "DevDemo/GenList/GenList.html","menu-data");

        //根菜单->开发示例->通用列表(不带查询)
        MenuEntity devDemoRootMenu_NoSearchList=createMenu(jb4DSession,devDemoRootMenu.getMenuId(),"JB4DDevDemoRoot_NoSearchList",
                "通用列表(不带查询)","通用列表(不带查询)","通用列表(不带查询)",
                "DevDemo/GenList/GenListNotSearch.html","menu-data");

        //根菜单->开发示例->通用列表(绑定数据字典)
        MenuEntity devDemoRootId_BindDictSearchList=createMenu(jb4DSession,devDemoRootMenu.getMenuId(),"JB4DDevDemoRoot_BindDictSearchList",
                "通用列表(绑定数据字典)","通用列表(绑定数据字典)","通用列表(绑定数据字典)",
                "DevDemo/GenList/GenListBindDictionary.html","menu-data");

        //根菜单->开发示例->通用列表(弹出列表)
        MenuEntity devDemoRootId_DialogSearchList=createMenu(jb4DSession,devDemoRootMenu.getMenuId(),"JB4DDevDemoRoot_DialogSearchList",
                "通用列表(弹出列表)","通用列表(弹出列表)","通用列表(弹出列表)",
                "DevDemo/DevDemoGenList/ListView","menu-data");

        //根菜单->开发示例->树形表格
        MenuEntity devDemoRootId_TreeTable=createMenu(jb4DSession,devDemoRootMenu.getMenuId(),"devDemoRootId_TreeTable",
                "树形表格","树形表格","树形表格",
                "DevDemo/TreeTable/TreeTableList.html","menu-data");

        //根菜单->开发示例->树与列表
        MenuEntity devDemoRootId_TreeAndList=createMenu(jb4DSession,devDemoRootMenu.getMenuId(),"devDemoRootId_TreeList",
                "树与列表","树与列表","树与列表",
                "DevDemo/TreeAndList/Manager.html","menu-data");

        //根菜单->系统设置分组
        MenuEntity systemSettingRootMenu=createMenu(jb4DSession,rootMenu.getMenuId(),"JB4DSystemSettingRoot","系统设置","系统设置","系统设置","","menu-data");

        //根菜单->系统设置分组->数据字典分组
        createMenu(jb4DSession,systemSettingRootMenu.getMenuId(),"systemSettingDictionaryManagerId",
                "数据字典","数据字典","数据字典",
                "System/Dictionary/DictionaryManager.html","");

        //根菜单->系统设置分组->操作日志
        createMenu(jb4DSession,systemSettingRootMenu.getMenuId(),"JB4DSystemSettingOperationLog",
                "操作日志","操作日志","操作日志",
                "System/OperationLog/OperationLogList.html","");

        //根菜单->系统设置分组->参数设置
        createMenu(jb4DSession,systemSettingRootMenu.getMenuId(),"JB4DSystemSettingParasSetting",
                "参数设置","参数设置","参数设置",
                "System/ParasSetting/ParasSettingList.html","");

        //根菜单->系统设置分组->代码生成
        createMenu(jb4DSession,systemSettingRootMenu.getMenuId(),"JB4DSystemSettingCodeGenerate",
                "代码生成","代码生成","代码生成",
                "System/CodeGeneration/Manager.html","");

        //根菜单->系统设置分组->组织管理


        //根菜单->系统设置分组->缓存管理
        createMenu(jb4DSession,systemSettingRootMenu.getMenuId(),"JB4DSystemSettingCacheManage",
                "缓存管理","缓存管理","缓存管理",
                "System/Cache/CacheList.html","");

        //根菜单->统一用户与单点登录
        MenuEntity ssoRootMenu=createMenu(jb4DSession,rootMenu.getMenuId(),"JB4DSSORootMenu",
                "单点登录与统一用户","单点登录与统一用户","单点登录与统一用户",
                "","");

        createMenu(jb4DSession,ssoRootMenu.getMenuId(),"JB4DOrganTypeManage",
                "组织类型","组织类型","组织类型",
                "SSO/OrganType/OrganTypeList.html","");

        createMenu(jb4DSession,ssoRootMenu.getMenuId(),"JB4DOrganManage",
                "组织机构","组织机构","组织机构",
                "SSO/Organ/OrganList.html","");

        createMenu(jb4DSession,ssoRootMenu.getMenuId(),"JB4DDepartmentManage",
                "部门管理","部门管理","部门管理",
                "SSO/Department/DepartmentManager.html","");

        createMenu(jb4DSession,ssoRootMenu.getMenuId(),"JB4DRoleManage",
                "角色管理","角色管理","角色管理",
                "SSO/Role/RoleManager.html","");

        createMenu(jb4DSession,ssoRootMenu.getMenuId(),"JB4DAppManage",
                "应用管理","应用管理","应用管理",
                "SSO/Application/ApplicationManager.html","");

        //根菜单->应用设计
        MenuEntity appBuilderRootMenu=createMenu(jb4DSession,rootMenu.getMenuId(),"JB4DSystemAppBuilderRoot",
                "应用设计","应用设计","应用设计",
                "","menu-data");

        //根菜单->应用管理->存储设计
        MenuEntity appManagerDataStorageMenu=createMenu(jb4DSession,appBuilderRootMenu.getMenuId(),"JB4DSystemAppBuilderDataStorageBuilder",
                "存储设计","存储设计","存储设计",
                "","top-menu-data");


        //根菜单->应用管理->存储设计->服务链接
        /*MenuEntity appBuilderDataLinkMenu=createMenu(jb4DSession,appManagerDataStorageMenu.getMenuId(),"JB4DSystemAppBuilderDataLink",
                "服务链接","服务链接","服务链接",
                "","top-menu-data");*/

        //根菜单->应用管理->存储设计->数据库管理
        MenuEntity appBuilderDataBaseMenu=createMenu(jb4DSession,appManagerDataStorageMenu.getMenuId(),"JB4DSystemAppBuilderDataBase",
                "数据库管理","数据库管理","数据库管理",
                "Builder/DataStorage/DataBase/Manager.html","frame-top-menu-data");

        //根菜单->应用管理->存储设计->数据关系
        MenuEntity appBuilderDataRelationMenu=createMenu(jb4DSession,appManagerDataStorageMenu.getMenuId(),"JB4DSystemAppBuilderDataRelation",
                "数据关系","数据关系","数据关系",
                "Builder/DataStorage/DataRelation/Manager.html","frame-top-menu-data");

        //根菜单->应用管理->数据集设计
        MenuEntity appBuilderDataSetMenu=createMenu(jb4DSession,appBuilderRootMenu.getMenuId(),"JB4DSystemAppBuilderDataSetBuilder",
                "数据集设计","数据集设计","数据集设计",
                "Builder/DataSet/Manager.html","top-menu-data");

        //根菜单->应用管理->模块设计
        MenuEntity appBuilderModuleBuilderMenu=createMenu(jb4DSession,appBuilderRootMenu.getMenuId(),"JB4DSystemAppBuilderModuleBuilder",
                "模块设计","模块设计","模块设计",
                "Builder/Module/Manager.html","frame-top-menu-data");

        //根菜单->应用管理->菜单设计
        MenuEntity appBuilderMenuBuilderMenu=createMenu(jb4DSession,appBuilderRootMenu.getMenuId(),"JB4DSystemAppBuilderMenuBuilder",
                "菜单设计","菜单设计","菜单设计",
                "","top-menu-data");

        //根菜单->应用管理->桌面设计
        MenuEntity appBuilderDesktopBuilderMenu=createMenu(jb4DSession,appBuilderRootMenu.getMenuId(),"JB4DSystemAppBuilderDesktopBuilder",
                "桌面设计","桌面设计","桌面设计",
                "","frame-top-menu-data");

        //根菜单->应用管理->大屏设计
        createMenu(jb4DSession,appBuilderRootMenu.getMenuId(),"JB4DSystemAppBuilderBigScreen",
                "大屏设计","大屏设计","大屏设计",
                "","frame-top-menu-data");
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
