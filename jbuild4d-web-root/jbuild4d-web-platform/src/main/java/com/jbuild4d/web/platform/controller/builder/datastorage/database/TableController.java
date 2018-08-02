package com.jbuild4d.web.platform.controller.builder.datastorage.database;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.platform.builder.exenum.TableFieldTypeEnum;
import com.jbuild4d.platform.builder.service.ITableFieldService;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
@Controller
@RequestMapping(value = "/PlatForm/Builder/DataStorage/DataBase/Table")
public class TableController {

    @Autowired
    ITableFieldService tableFieldService;

    @RequestMapping(value = "EditTable", method = RequestMethod.GET)
    public ModelAndView editTable(String recordId, String op) throws IllegalAccessException, InstantiationException, IOException {
        ModelAndView modelAndView=new ModelAndView("Builder/DataStorage/DataBase/TableEdit");
        List<String> templateNames=tableFieldService.getFieldTemplateName();
        Map<String,List<TableFieldVO>> templateFieldMap=new HashMap<>();
        for (String templateName : templateNames) {
            List<TableFieldVO> fields=tableFieldService.getTemplateFieldsByName(templateName);
            templateFieldMap.put(templateName,fields);
        }
        modelAndView.addObject("templateFieldGroup",JsonUtility.toObjectString(templateFieldMap));
        modelAndView.addObject("op",op);
        return modelAndView;
    }

    @RequestMapping(value = "/GetTableFieldType")
    @ResponseBody
    public JBuild4DResponseVo getFieldDataType() throws JBuild4DGenerallyException {
        return JBuild4DResponseVo.success("", TableFieldTypeEnum.getJsonString());
    }

    @RequestMapping(value = "/GetFieldTemplateName")
    @ResponseBody
    public JBuild4DResponseVo getFieldTemplateName(){
        List<String> namesList=tableFieldService.getFieldTemplateName();
        return JBuild4DResponseVo.success("",namesList);
    }

    @RequestMapping(value = "/GetTemplateFieldsByName")
    @ResponseBody
    public JBuild4DResponseVo getTemplateFieldsByName(String templateName) throws IOException {
        List<TableFieldVO> tableFieldEntityList=tableFieldService.getTemplateFieldsByName(templateName);
        return JBuild4DResponseVo.success("",tableFieldEntityList);
    }
}
