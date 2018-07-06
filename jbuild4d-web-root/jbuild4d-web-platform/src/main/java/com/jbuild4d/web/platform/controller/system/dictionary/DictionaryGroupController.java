package com.jbuild4d.web.platform.controller.system.dictionary;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import com.jbuild4d.web.platform.controller.base.BaseController;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/System/DictionaryGroup")
public class DictionaryGroupController extends BaseController {

    @Autowired
    IDictionaryGroupService dictionaryGroupService;

    @Override
    @RequestMapping(value = "List", method = RequestMethod.GET)
    public ModelAndView list() {
        ModelAndView modelAndView=new ModelAndView("System/Dictionary/DictionaryGroupList");
        return modelAndView;
    }

    @Override
    @RequestMapping(value = "GetListData", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String search_condition) {
        PageInfo<DictionaryGroupEntity> proOrganPageInfo=dictionaryGroupService.getPage(pageNum,pageSize);
        return JBuild4DResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "Detail", method = RequestMethod.GET)
    public ModelAndView detail(String recordId,String op) {
        ModelAndView modelAndView=new ModelAndView("System/Dictionary/DictionaryGroupEdit");

        DictionaryGroupEntity entity=null;
        if(StringUtility.isEmpty(recordId)) {
            entity=new DictionaryGroupEntity();
            modelAndView.addObject("recordId", UUIDUtility.getUUID());
        }
        else {
            entity=dictionaryGroupService.getByPrimaryKey(recordId);
            modelAndView.addObject("recordId", recordId);
        }
        modelAndView.addObject("entity",entity);
        modelAndView.addObject("op",op);
        return modelAndView;
    }

    @RequestMapping(value = "SaveEdit", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo saveEdit(@RequestBody DictionaryGroupEntity dictionaryEntity) {
        try {
            dictionaryGroupService.saveBySelective(dictionaryEntity.getDictGroupId(), dictionaryEntity);
            return JBuild4DResponseVo.saveSuccess();
        } catch (JBuild4DGenerallyException e) {
            return JBuild4DResponseVo.error(e.getMessage());
        }
    }

    @RequestMapping(value = "StatusChange", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo statusChange(String ids,String status) {
        dictionaryGroupService.statusChange(ids,status);
        //dictionaryGroupService.saveBySelective(dictionaryEntity.getDictGroupId(), dictionaryEntity);
        return JBuild4DResponseVo.saveSuccess();
    }
}
