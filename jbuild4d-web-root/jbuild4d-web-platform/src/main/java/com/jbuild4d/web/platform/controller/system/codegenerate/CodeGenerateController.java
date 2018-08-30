package com.jbuild4d.web.platform.controller.system.codegenerate;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.search.GeneralSearchUtility;
import com.jbuild4d.platform.system.service.ICodeGenerateService;
import com.jbuild4d.platform.system.vo.SimpleTableFieldVo;
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
import java.text.ParseException;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/25
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/System/CodeGenerate")
public class CodeGenerateController {

    @Autowired
    ICodeGenerateService codeGenerateService;

    @RequestMapping(value = "Manager", method = RequestMethod.GET)
    public ModelAndView manger() {
        ModelAndView modelAndView=new ModelAndView("System/DBResolver/Manager");
        return modelAndView;
    }

    @RequestMapping(value = "GetListData", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getListData(Integer pageSize, Integer pageNum, String searchCondition) throws IOException, ParseException, JBuild4DGenerallyException {
        JB4DSession jb4DSession = JB4DSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<List<Map<String, Object>>> proOrganPageInfo=codeGenerateService.getTables(jb4DSession,pageNum,pageSize,searchMap);
        return JBuild4DResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "GetTableGenerateCode", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getTableGenerateCode(String tableName,String packageType,String packageLevel2Name,String orderFieldName,String statusFieldName) throws IOException, ParseException, XPathExpressionException, SAXException, ParserConfigurationException {
        JB4DSession jb4DSession = JB4DSessionUtility.getSession();
        Map<String,String> result=codeGenerateService.getTableGenerateCode(jb4DSession,tableName,orderFieldName,statusFieldName,packageType,packageLevel2Name);
        return JBuild4DResponseVo.success("获取成功",result);
    }

    @RequestMapping(value = "GetTableFields", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getTableFields(String tableName) throws IOException, ParseException, JBuild4DGenerallyException {
        JB4DSession jb4DSession = JB4DSessionUtility.getSession();
        List<SimpleTableFieldVo> result=codeGenerateService.getTableFields(jb4DSession,tableName);
        return JBuild4DResponseVo.success("获取成功",result);
    }
}
