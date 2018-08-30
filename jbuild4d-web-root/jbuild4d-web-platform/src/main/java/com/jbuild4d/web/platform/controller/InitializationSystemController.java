package com.jbuild4d.web.platform.controller;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.system.service.IMenuService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.text.ParseException;

@Controller
public class InitializationSystemController {

    @Autowired
    private IMenuService menuService;

    @RequestMapping(value = "/Running", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo running() throws JBuild4DGenerallyException {
        JB4DSession jb4DSession=JB4DSessionUtility.getSession();

        menuService.initSystemData(jb4DSession);

        return JBuild4DResponseVo.opSuccess();
    }
}
