package com.jbuild4d.web.platform.controller.selectview;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.platform.system.service.IEnvVariableService;
import com.jbuild4d.platform.system.vo.EnvVariableVo;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ModelAndView select() {
        ModelAndView modelAndView=new ModelAndView("SelectView/SelectEnvVariable");
        return modelAndView;
    }

    @RequestMapping(value = "GetSelectData",method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getSelectData() throws XPathExpressionException, ParserConfigurationException, JBuild4DGenerallyException, SAXException, IOException {
        Map<String,List<EnvVariableVo>> resultData=new HashMap<>();
        List<EnvVariableVo> dateTimeVoList=envVariableService.getDateTimeVars();
        List<EnvVariableVo> apiVarVoList=envVariableService.getAPIVars();
        resultData.put("datetimeTreeData",dateTimeVoList);
        resultData.put("envVarTreeData",apiVarVoList);
        return JBuild4DResponseVo.success("获取成功!",resultData);
    }
}
