package com.jbuild4d.web.platform.controller.system.dictionary;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.DictionaryEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.system.service.IDictionaryService;
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
@RequestMapping(value = "/PlatForm/System/Dictionary")
public class DictionaryController extends GeneralCRUDImplController<DictionaryEntity> {

    @Autowired
    IDictionaryService dictionaryService;

    @Override
    protected IBaseService<DictionaryEntity> getBaseService() {
        return dictionaryService;
    }

    @Override
    public String getListViewName() {
        return "";
    }

    @Override
    public String getDetailViewName() {
        return "System/Dictionary/DictionaryEdit";
    }

    @RequestMapping(value = "/GetListDataByGroupId", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getListDataByGroupId(String groupId) {
        List<DictionaryEntity> dictionaryEntityList=dictionaryService.getListDataByGroupId(JB4DSessionUtility.getSession(),groupId);
        return JBuild4DResponseVo.success("",dictionaryEntityList);
    }

    @RequestMapping(value = "/SetSelected", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo setSelected(String recordId) throws JBuild4DGenerallyException {
        dictionaryService.setSelected(JB4DSessionUtility.getSession(),recordId);
        return JBuild4DResponseVo.opSuccess();
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "数据字典";
    }
}
