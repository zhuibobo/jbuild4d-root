package com.jbuild4d.web.platform.controller.system.dictionary;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import com.jbuild4d.web.platform.controller.base.GeneralCRUDImplController;
import com.jbuild4d.web.platform.controller.base.IGeneralCRUDController;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

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

    @RequestMapping(value = "MoveUp", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo moveUp(String recordId) {
        //dictionaryGroupService.moveUp(recordId);
        return JBuild4DResponseVo.opSuccess();
    }


}
