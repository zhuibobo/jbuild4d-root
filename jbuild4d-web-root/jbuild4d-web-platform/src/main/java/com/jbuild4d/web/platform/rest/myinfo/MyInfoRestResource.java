package com.jbuild4d.web.platform.rest.myinfo;

import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatForm/MyInfo")
public class MyInfoRestResource {

    @RequestMapping(value = "/GetUserInfo", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getUserInfo() {
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        return JBuild4DResponseVo.success("获取成功",jb4DSession);
    }

}
