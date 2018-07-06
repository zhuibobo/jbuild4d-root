package com.jbuild4d.web.platform.controller.base;

import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public abstract class BaseController {

    public abstract ModelAndView list();

    public abstract JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String search_condition);
}
