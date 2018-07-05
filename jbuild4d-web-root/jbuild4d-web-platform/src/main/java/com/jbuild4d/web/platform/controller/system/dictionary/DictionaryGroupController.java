package com.jbuild4d.web.platform.controller.system.dictionary;

import com.jbuild4d.web.platform.controller.base.BaseController;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/System/DictionaryGroup")
public class DictionaryGroupController extends BaseController {

    @Override
    @RequestMapping(value = "List", method = RequestMethod.GET)
    public ModelAndView list() {
        ModelAndView modelAndView=new ModelAndView("System/Dictionary/DictionaryGroupList");
        return modelAndView;
    }

    @Override
    public JBuild4DResponseVo getListData() {
        return null;
    }
}
