package com.jbuild4d.web.platform.rest.sso.department;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.SettingEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.sso.service.IDepartmentUserService;
import com.jbuild4d.platform.sso.vo.DepartmentUserVo;
import com.jbuild4d.platform.system.service.IOperationLogService;
import com.jbuild4d.platform.system.service.ISettingService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/DepartmentUser")
public class DepartmentUserRestResource {
    @Autowired
    IOperationLogService operationLogService;

    @Autowired
    IDepartmentUserService departmentUserService;

    @Autowired
    ISettingService settingService;

    @RequestMapping(value = "/SaveEdit", method = RequestMethod.POST)
    public JBuild4DResponseVo saveEdit(@RequestBody DepartmentUserVo entity, HttpServletRequest request) throws JBuild4DGenerallyException {
        try {
            JB4DSession jb4DSession = JB4DSessionUtility.getSession();
            SettingEntity defaultPasswordSetting = settingService.getByKey(jb4DSession, ISettingService.SETTINGUSERDEFAULTPASSWORD);
            String defaultPassword=defaultPasswordSetting==null?"jb4d123456":defaultPasswordSetting.getSettingValue();
            departmentUserService.save(jb4DSession, entity.getDepartmentUserEntity().getDuId(), entity, defaultPassword);
            return JBuild4DResponseVo.success(JBuild4DResponseVo.SUCCESSMSG);
        } catch (JBuild4DGenerallyException e) {
            return JBuild4DResponseVo.error(e.getMessage());
        }
        catch (Exception e){
            return JBuild4DResponseVo.error(e.getMessage());
        }
    }
}
