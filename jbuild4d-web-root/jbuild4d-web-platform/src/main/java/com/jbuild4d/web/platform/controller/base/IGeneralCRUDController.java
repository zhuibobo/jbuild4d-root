package com.jbuild4d.web.platform.controller.base;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.impl.BaseService;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public interface IGeneralCRUDController<T> {

    public abstract ModelAndView list();

    public abstract JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String search_condition);

    public abstract ModelAndView detail(String recordId,String op) throws IllegalAccessException, InstantiationException;

    public abstract JBuild4DResponseVo saveEdit(@RequestBody T entity) throws Exception;

    public abstract JBuild4DResponseVo statusChange(String ids,String status);

    public abstract JBuild4DResponseVo Delete(String recordId);
}
