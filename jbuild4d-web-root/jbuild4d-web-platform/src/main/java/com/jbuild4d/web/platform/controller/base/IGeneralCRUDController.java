package com.jbuild4d.web.platform.controller.base;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public interface IGeneralCRUDController<T> {

    ModelAndView listView() throws JsonProcessingException;

    ModelAndView detailView();

    JBuild4DResponseVo getListData(Integer pageSize, Integer pageNum, String search_condition) throws IOException, ParseException;

    JBuild4DResponseVo saveEdit(@RequestBody T entity, HttpServletRequest request) throws Exception;

    JBuild4DResponseVo statusChange(String ids, String status, HttpServletRequest request) throws JsonProcessingException;

    JBuild4DResponseVo delete(String recordId, HttpServletRequest request) throws JBuild4DGenerallyException, JsonProcessingException;

    JBuild4DResponseVo move(String recordId, String type, HttpServletRequest request) throws JBuild4DGenerallyException, JsonProcessingException;
}
