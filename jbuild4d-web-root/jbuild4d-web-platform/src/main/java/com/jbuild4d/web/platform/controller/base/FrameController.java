package com.jbuild4d.web.platform.controller.base;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/PlatForm/Base")
public class FrameController {

    @Autowired
    JsonUtility jsonUtility;

    @RequestMapping(value = "Frame", method = RequestMethod.GET)
    public ModelAndView frame() throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView("Frame");
        modelAndView.addObject("menuJson","");
        JB4DSession session= JB4DSessionUtility.getSession();
        modelAndView.addObject("currUserEntity", jsonUtility.toObjectString(session));
        return modelAndView;
    }
}
