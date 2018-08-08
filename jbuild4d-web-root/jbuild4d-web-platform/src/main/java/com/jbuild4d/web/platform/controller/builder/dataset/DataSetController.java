package com.jbuild4d.web.platform.controller.builder.dataset;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/7
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/DataSet/DataSetDesign")
public class DataSetController {

    @RequestMapping(value = "EditDataSet", method = RequestMethod.GET)
    public ModelAndView editDataSet(String recordId, String op, String groupId) {
        ModelAndView modelAndView=new ModelAndView("Builder/DataSet/DataSetEdit");
        return modelAndView;
    }
}
