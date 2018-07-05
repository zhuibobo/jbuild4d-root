package com.jbuild4d.web.platform.controller.system.dictionary;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.web.platform.controller.base.BaseController;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/System/Dictionary")
public class DictionaryController extends BaseController {

    @Override
    @RequestMapping(value = "List", method = RequestMethod.GET)
    public ModelAndView list() {
        ModelAndView modelAndView=new ModelAndView("System/Dictionary/DictionaryList");
        return modelAndView;
    }

    @RequestMapping(value = "GetListData", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getListData(){
        //List<ProDictionaryEntity> proOrganPageInfo=proDictionaryService.getALL();
        return JBuild4DResponseVo.success("获取成功",null);
    }
}
