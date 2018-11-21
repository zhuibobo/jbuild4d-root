package com.jbuild4d.web.platform.controller.system.dictionary;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.DictionaryGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/System/DictionaryGroup")
public class DictionaryGroupController extends GeneralCRUDImplController<DictionaryGroupEntity> {

    @Autowired
    IDictionaryGroupService dictionaryGroupService;

    @Override
    protected IBaseService<DictionaryGroupEntity> getBaseService() {
        return dictionaryGroupService;
    }

    @Override
    public String getListViewName() {
        return "";
    }

    @Override
    public String getDetailViewName() {
        return "System/Dictionary/DictionaryGroupEdit";
    }

    @Override
    public String getjBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "数据字典分组";
    }

    @RequestMapping(value = "MoveUp", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo moveUp(String recordId) {
        //dictionaryGroupService.moveUp(recordId);
        return JBuild4DResponseVo.opSuccess();
    }

    @RequestMapping(value = "GetTreeData", method = RequestMethod.POST)
    @ResponseBody
    public List<DictionaryGroupEntity> getTreeData() {
        //dictionaryGroupService.moveUp(recordId);
        List<DictionaryGroupEntity> dictionaryGroupEntityList=dictionaryGroupService.getALL(JB4DSessionUtility.getSession());
        return dictionaryGroupEntityList;
    }
}
