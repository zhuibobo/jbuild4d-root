package com.jbuild4d.web.platform.controller.selectview;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.platform.system.service.IEnvVariableService;
import com.jbuild4d.platform.system.vo.EnvVariableVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.xml.xpath.XPathExpressionException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/4
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/SelectView/SelectEnvVariable")
public class SelectEnvVariableController {

    @Autowired
    IEnvVariableService envVariableService;

    @RequestMapping(value = "Select", method = RequestMethod.GET)
    public ModelAndView select() throws XPathExpressionException, JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView("SelectView/SelectEnvVariable");

        List<EnvVariableVo> dateTimeVoList=envVariableService.getDateTimeVars();
        List<EnvVariableVo> apiVarVoList=envVariableService.getAPIVars();

        modelAndView.addObject("datetimeTreeData", JsonUtility.toObjectString(dateTimeVoList));
        modelAndView.addObject("envVarTreeData",JsonUtility.toObjectString(apiVarVoList));

        return modelAndView;
    }
}
