package com.jbuild4d.web.platform.rest.base;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;

public interface IGeneralRestResource<T> {

    JBuild4DResponseVo getListData(Integer pageSize, Integer pageNum, String search_condition, boolean loadDict) throws IOException, ParseException;

    JBuild4DResponseVo saveEdit(@RequestBody T entity, HttpServletRequest request) throws Exception;

    JBuild4DResponseVo statusChange(String ids, String status, HttpServletRequest request) throws JsonProcessingException;

    JBuild4DResponseVo delete(String recordId, HttpServletRequest request) throws JBuild4DGenerallyException, JsonProcessingException;

    JBuild4DResponseVo move(String recordId, String type, HttpServletRequest request) throws JBuild4DGenerallyException, JsonProcessingException;
}
