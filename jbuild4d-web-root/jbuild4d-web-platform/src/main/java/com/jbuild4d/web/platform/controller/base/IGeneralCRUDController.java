package com.jbuild4d.web.platform.controller.base;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.text.ParseException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public interface IGeneralCRUDController<T> {

    public abstract ModelAndView list() throws JsonProcessingException;

    public abstract JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String search_condition) throws IOException, ParseException;

    public abstract ModelAndView detail(String recordId,String op) throws IllegalAccessException, InstantiationException;

    public abstract JBuild4DResponseVo saveEdit(@RequestBody T entity) throws Exception;

    public abstract JBuild4DResponseVo statusChange(String ids,String status);

    public abstract JBuild4DResponseVo delete(String recordId) throws JBuild4DGenerallyException;

    public abstract JBuild4DResponseVo move(String recordId,String type) throws JBuild4DGenerallyException;
}
