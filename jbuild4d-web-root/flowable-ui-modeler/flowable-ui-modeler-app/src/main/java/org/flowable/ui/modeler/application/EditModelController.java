package org.flowable.ui.modeler.application;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/11
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/custom-editor-model")
public class EditModelController {
    @RequestMapping(value = "edit")
    public ModelAndView edit(){
        ModelAndView modelAndView=new ModelAndView();
        modelAndView.setViewName("forward:/custom-editor-model/edit-model.html");
        return modelAndView;
    }
}
