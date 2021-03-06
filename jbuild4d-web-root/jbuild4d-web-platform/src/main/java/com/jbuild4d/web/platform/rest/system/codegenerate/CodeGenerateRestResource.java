package com.jbuild4d.web.platform.rest.system.codegenerate;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.service.search.GeneralSearchUtility;
import com.jbuild4d.code.generate.service.ICodeGenerateService;
import com.jbuild4d.code.generate.vo.SimpleTableFieldVo;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.IOException;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/PlatFormRest/System/CodeGenerate")
public class CodeGenerateRestResource {
    @Autowired
    ICodeGenerateService codeGenerateService;

    @RequestMapping(value = "/GetListData", method = RequestMethod.POST)
    public JBuild4DResponseVo getListData(Integer pageSize, Integer pageNum, String searchCondition) throws IOException, ParseException, JBuild4DGenerallyException {
        JB4DSession jb4DSession = JB4DSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        PageInfo<List<Map<String, Object>>> proOrganPageInfo=codeGenerateService.getTables(jb4DSession,pageNum,pageSize,searchMap);
        return JBuild4DResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "/GetTableGenerateCode", method = RequestMethod.POST)
    public JBuild4DResponseVo getTableGenerateCode(String tableName,String packageType,String packageLevel2Name,String orderFieldName,String statusFieldName) throws IOException, ParseException, XPathExpressionException, SAXException, ParserConfigurationException {
        JB4DSession jb4DSession = JB4DSessionUtility.getSession();
        Map<String,String> result=codeGenerateService.getTableGenerateCode(jb4DSession,tableName,orderFieldName,statusFieldName,packageType,packageLevel2Name);
        return JBuild4DResponseVo.success("获取成功",result);
    }

    @RequestMapping(value = "/GetTableFields", method = RequestMethod.POST)
    public JBuild4DResponseVo getTableFields(String tableName) throws IOException, ParseException, JBuild4DGenerallyException {
        JB4DSession jb4DSession = JB4DSessionUtility.getSession();
        List<SimpleTableFieldVo> result=codeGenerateService.getTableFields(jb4DSession,tableName);
        return JBuild4DResponseVo.success("获取成功",result);
    }
}
