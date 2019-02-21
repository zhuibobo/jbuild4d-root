package com.jbuild4d.web.platform.controller.base;



import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.anno.DBAnnoUtility;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.DictionaryEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.common.ClassUtility;
import com.jbuild4d.base.tools.common.JsonUtility;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.base.tools.common.search.GeneralSearchUtility;
import com.jbuild4d.platform.system.service.IDictionaryService;
import com.jbuild4d.platform.system.service.IOperationLogService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import com.jbuild4d.web.platform.rest.base.IGeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public abstract class GeneralCRUDImplController<T> implements IGeneralCRUDController<T> {

    @Autowired
    IDictionaryService dictionaryService;

    @Autowired
    IOperationLogService operationLogService;

    /*protected abstract IBaseService<T> getBaseService();*/

    public abstract String getListViewName();

    public abstract String getDetailViewName();

    @RequestMapping(value = "/DetailView", method = RequestMethod.GET)
    public ModelAndView detailView(){
        ModelAndView modelAndView=new ModelAndView(getDetailViewName());
        return modelAndView;
    }

    @RequestMapping(value = "/ListView", method = RequestMethod.GET)
    public ModelAndView listView() throws JsonProcessingException {
        ModelAndView modelAndView=new ModelAndView(getListViewName());
        //List<String> dictionaryGroupValueList=bindDictionaryToPage();
        //String dictionaryJsonString=getDictionaryJsonString(dictionaryGroupValueList);
        //modelAndView.addObject("dictionaryJson", dictionaryJsonString);
        return modelAndView;
    }

    /*public List<String> bindDictionaryToPage(){
        return null;
    }

    protected Map<String,Object> bindObjectsToMV(){
        return null;
    }*/
}
