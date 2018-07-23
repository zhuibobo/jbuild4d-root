package com.jbuild4d.service;

import com.jbuild4d.base.dbaccess.dbentities.*;
import com.jbuild4d.base.dbaccess.exenum.MenuTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.system.service.*;
import com.jbuild4d.web.platform.beanconfig.mybatis.MybatisBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.DevDemoBeansConfig;
import com.jbuild4d.web.platform.beanconfig.service.SystemBeansConfig;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.PrimitiveIterator;

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

    @Autowired
    private IDevDemoTreeTableService devDemoTreeTableService;

    @Autowired
    private IDictionaryService dictionaryService;

    @Test
    public void initSystem() throws JBuild4DGenerallyException {

        //根菜单
        String rootMenuId="0";
        MenuEntity rootMenu=getMenu("-1",rootMenuId,"Root","Root","Root",MenuTypeEnum.Root.getDisplayName(),"","","");
        menuService.deleteByKey(jb4DSession,rootMenu.getMenuId());
        menuService.save(jb4DSession,rootMenu.getMenuId(),rootMenu);

        //根菜单->系统设置分组
        String systemSettingRootId="JB4DSystemSettingRoot";
        MenuEntity systemSettingMenu=getMenu(rootMenu.getMenuId(),systemSettingRootId,"系统设置","系统设置","系统设置",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"LeftMenu.do","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,systemSettingMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingMenu.getMenuId(),systemSettingMenu);

        //根菜单->系统设置分组->数据字典分组
        String systemSettingDictionaryManagerId="JB4DSystemSettingDictionaryManager";
        MenuEntity systemSettingDictionaryGroupMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingDictionaryManagerId,"数据字典","数据字典","数据字典",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/Dictionary/DictionaryManager.do","");
        menuService.deleteByKey(jb4DSession,systemSettingDictionaryGroupMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingDictionaryGroupMenu.getMenuId(),systemSettingDictionaryGroupMenu);

        //根菜单->系统设置分组->参数设置
        String systemSettingParasSettingId="JB4DSystemSettingParasSetting";
        MenuEntity systemSettingParasSettingMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingParasSettingId,"参数设置","参数设置","参数设置",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/ParasSetting/List.do","");
        menuService.deleteByKey(jb4DSession,systemSettingParasSettingMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingParasSettingMenu.getMenuId(),systemSettingParasSettingMenu);

        //根菜单->系统设置分组->组织管理
        String systemSettingOrganManageId="JB4DSystemSettingOrganManage";
        MenuEntity systemSettingOrganManageMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingOrganManageId,"组织管理","组织管理","组织管理",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/ParasSetting/List.do","");
        menuService.deleteByKey(jb4DSession,systemSettingOrganManageMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingOrganManageMenu.getMenuId(),systemSettingOrganManageMenu);

        //根菜单->系统设置分组->操作日志
        String systemSettingOperationLogId="JB4DSystemSettingOperationLog";
        MenuEntity systemSettingOperationLogMenu=getMenu(systemSettingMenu.getMenuId(),systemSettingOperationLogId,"操作日志","操作日志","操作日志",
                MenuTypeEnum.LeftMenu.getDisplayName(),"","/PlatForm/System/ParasSetting/List.do","");
        menuService.deleteByKey(jb4DSession,systemSettingOperationLogMenu.getMenuId());
        menuService.save(jb4DSession,systemSettingOperationLogMenu.getMenuId(),systemSettingOperationLogMenu);

        //根菜单->开发示例
        String devDemoRootId="JB4DDevDemoRoot";
        MenuEntity devDemoRootMenu=getMenu(rootMenu.getMenuId(),devDemoRootId,"开发示例","开发示例","开发示例",
                MenuTypeEnum.GroupTopMenu.getDisplayName(),"/PlatForm/DevDemo/Menus.do","","frame-top-menu-data");
        menuService.deleteByKey(jb4DSession,devDemoRootId);
        menuService.save(jb4DSession,devDemoRootMenu.getMenuId(),devDemoRootMenu);

        //根字典分组
        String rootDictionaryId="0";
        DictionaryGroupEntity rootDictionaryGroupEntity=getDictionaryGroup(rootDictionaryId,"数据字典分组","数据字典分组","","-1",TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        dictionaryGroupService.deleteByKeyNotValidate(jb4DSession,rootDictionaryGroupEntity.getDictGroupId());
        dictionaryGroupService.save(jb4DSession,rootDictionaryGroupEntity.getDictGroupId(),rootDictionaryGroupEntity);

        String DevDemoDictionaryGroupRootId="DevDemoDictionaryGroupRoot";
        DictionaryGroupEntity devDemoDictionaryGroupEntity=getDictionaryGroup(DevDemoDictionaryGroupRootId,"开发示例","开发示例","",rootDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        dictionaryGroupService.deleteByKeyNotValidate(jb4DSession,devDemoDictionaryGroupEntity.getDictGroupId());
        dictionaryGroupService.save(jb4DSession,devDemoDictionaryGroupEntity.getDictGroupId(),devDemoDictionaryGroupEntity);

        String DevDemoDictionaryGroupBindSelect="DevDemoDictionaryGroupBindSelect";
        DictionaryGroupEntity DevDemoDictionaryGroupBindSelectEntity=getDictionaryGroup(DevDemoDictionaryGroupBindSelect,"DevDemoDictionaryGroupBindSelect","绑定下拉列表","",devDemoDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        dictionaryGroupService.deleteByKeyNotValidate(jb4DSession,DevDemoDictionaryGroupBindSelectEntity.getDictGroupId());
        dictionaryGroupService.save(jb4DSession,DevDemoDictionaryGroupBindSelectEntity.getDictGroupId(),DevDemoDictionaryGroupBindSelectEntity);

        String DevDemoDictionaryGroupBindRadio="DevDemoDictionaryGroupBindRadio";
        DictionaryGroupEntity DevDemoDictionaryGroupBindRadioEntity=getDictionaryGroup(DevDemoDictionaryGroupBindRadio,"DevDemoDictionaryGroupBindRadio","绑定单选项","",devDemoDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        dictionaryGroupService.deleteByKeyNotValidate(jb4DSession,DevDemoDictionaryGroupBindRadioEntity.getDictGroupId());
        dictionaryGroupService.save(jb4DSession,DevDemoDictionaryGroupBindRadioEntity.getDictGroupId(),DevDemoDictionaryGroupBindRadioEntity);

        String DevDemoDictionaryGroupBindCheckbox="DevDemoDictionaryGroupBindCheckbox";
        DictionaryGroupEntity DevDemoDictionaryGroupBindCheckboxEntity=getDictionaryGroup(DevDemoDictionaryGroupBindCheckbox,"DevDemoDictionaryGroupBindCheckbox","绑定复选项","",devDemoDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        dictionaryGroupService.deleteByKeyNotValidate(jb4DSession,DevDemoDictionaryGroupBindCheckboxEntity.getDictGroupId());
        dictionaryGroupService.save(jb4DSession,DevDemoDictionaryGroupBindCheckboxEntity.getDictGroupId(),DevDemoDictionaryGroupBindCheckboxEntity);

        //生成开发示例中使用到的数据字典项
        for(int i=0;i<10;i++){
            String select_dic_id=DevDemoDictionaryGroupBindSelect+String.valueOf(i);
            DictionaryEntity selectDictionaryEntity=getDictionary(DevDemoDictionaryGroupBindSelect,select_dic_id,DevDemoDictionaryGroupBindSelect,"Select-Key-"+i,"Select-Value-"+i,"Select-Text-"+i);
            dictionaryService.deleteByKeyNotValidate(jb4DSession,select_dic_id);
            dictionaryService.save(jb4DSession,select_dic_id,selectDictionaryEntity);

            String radio_dic_id=DevDemoDictionaryGroupBindRadio+String.valueOf(i);
            DictionaryEntity radioDictionaryEntity=getDictionary(DevDemoDictionaryGroupBindRadio,radio_dic_id,DevDemoDictionaryGroupBindRadio,"Radio-Key-"+i,"Radio-Value-"+i,"Radio-Text-"+i);
            dictionaryService.deleteByKeyNotValidate(jb4DSession,radio_dic_id);
            dictionaryService.save(jb4DSession,radio_dic_id,radioDictionaryEntity);

            String checkbox_dic_id=DevDemoDictionaryGroupBindCheckbox+String.valueOf(i);
            DictionaryEntity checkboxDictionaryEntity=getDictionary(DevDemoDictionaryGroupBindCheckbox,checkbox_dic_id,DevDemoDictionaryGroupBindCheckbox,"Checkbox-Key-"+i,"Checkbox-Value-"+i,"Checkbox-Text-"+i);
            dictionaryService.deleteByKeyNotValidate(jb4DSession,checkbox_dic_id);
            dictionaryService.save(jb4DSession,checkbox_dic_id,checkboxDictionaryEntity);
        }

        devDemoGenListService.deleteAll(jb4DSession);
        //测试数据
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
        }

        //DevDemoTreeTable根节点
        //DevDemoTreeTableEntity treeTableEntity=new DevDemoTreeTableEntity();
        devDemoTreeTableService.deleteByKey(jb4DSession,"0");
        DevDemoTreeTableEntity treeTableRootEntity=devDemoTreeTableService.createRootNode(jb4DSession);
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
        dictionaryGroupEntity.setDictGroupEnpItem(TrueFalseEnum.True.getDisplayName());
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

    public DictionaryEntity getDictionary(String parentId,String id,String groupId,String key,String value,String text){
        DictionaryEntity dictionaryEntity=new DictionaryEntity();
        dictionaryEntity.setDictId(id);
        dictionaryEntity.setDictIsSelected("否");
        dictionaryEntity.setDictStatus("启用");
        dictionaryEntity.setDictParentId(parentId);
        dictionaryEntity.setDictDelEnable("是");
        dictionaryEntity.setDictIssystem("是");
        dictionaryEntity.setDictGroupId(groupId);
        dictionaryEntity.setDictKey(key);
        dictionaryEntity.setDictText(text);
        dictionaryEntity.setDictValue(value);
        return dictionaryEntity;
    }
}
