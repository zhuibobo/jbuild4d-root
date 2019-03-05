package com.jbuild4d.web.platform.rest.sso.department;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.dbaccess.dbentities.files.FileInfoEntity;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.SettingEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.base.tools.common.search.GeneralSearchUtility;
import com.jbuild4d.platform.files.service.IFileInfoService;
import com.jbuild4d.platform.sso.service.IDepartmentUserService;
import com.jbuild4d.platform.sso.vo.DepartmentUserVo;
import com.jbuild4d.platform.system.service.IOperationLogService;
import com.jbuild4d.platform.system.service.ISettingService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/DepartmentUser")
public class DepartmentUserRestResource {
    @Autowired
    IOperationLogService operationLogService;

    @Autowired
    IDepartmentUserService departmentUserService;

    @Autowired
    ISettingService settingService;

    @Autowired
    IFileInfoService fileInfoService;

    @RequestMapping(value = "/GetEmptyNewVo",method = RequestMethod.POST)
    public JBuild4DResponseVo getEmptyNewVo(String departmentId) throws JBuild4DGenerallyException {
        JB4DSession jb4DSession = JB4DSessionUtility.getSession();
        return JBuild4DResponseVo.success(JBuild4DResponseVo.GETDATASUCCESSMSG,departmentUserService.getEmptyNewVo(jb4DSession,departmentId));
    }

    @RequestMapping(value = "/GetVo",method = RequestMethod.POST)
    public JBuild4DResponseVo getVo(String recordId) throws JBuild4DGenerallyException {
        JB4DSession jb4DSession = JB4DSessionUtility.getSession();
        return JBuild4DResponseVo.success(JBuild4DResponseVo.GETDATASUCCESSMSG,departmentUserService.getVo(jb4DSession,recordId));
    }

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

    @RequestMapping(value = "/UploadUserHeadIMG", method = RequestMethod.POST, produces = "application/json")
    public JBuild4DResponseVo uploadUserHeadIMG(HttpServletRequest request, @RequestParam("file") MultipartFile file) throws IOException {
        FileInfoEntity fileInfoEntity=fileInfoService.addSmallFileToDB(JB4DSessionUtility.getSession(),file);
        return JBuild4DResponseVo.success(JBuild4DResponseVo.SUCCESSMSG,fileInfoEntity);
    }

    @RequestMapping(value = "/GetUserHeadIMG", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getUserHeadIMG(String fileId) throws IOException, JBuild4DGenerallyException {
        FileInfoEntity fileInfoEntity=fileInfoService.getByPrimaryKey(JB4DSessionUtility.getSession(),fileId);
        if(fileInfoEntity==null) {
            //String cacheKey = "UserDefaultIMG";
            if (JB4DCacheManager.exist(JB4DCacheManager.jb4dPlatformBuilderCacheName, JB4DCacheManager.CACHE_KEY_USER_HEAD_IMG)) {
                return JB4DCacheManager.getObject(JB4DCacheManager.jb4dPlatformBuilderCacheName, JB4DCacheManager.CACHE_KEY_USER_HEAD_IMG);
            } else {
                InputStream is = this.getClass().getResourceAsStream("/static/Themes/Default/Css/Images/UserImg.png");
                byte[] defaultImageByte = IOUtils.toByteArray(is);
                is.close();
                JB4DCacheManager.put(JB4DCacheManager.jb4dPlatformBuilderCacheName, JB4DCacheManager.CACHE_KEY_USER_HEAD_IMG, defaultImageByte);
                return defaultImageByte;
            }
        }
        else{
            return fileInfoService.getContent(fileId);
        }
    }

    @RequestMapping(value = "/GetListData",method = RequestMethod.POST)
    public JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String searchCondition) throws IOException, ParseException {
        JB4DSession jb4DSession= JB4DSessionUtility.getSession();
        Map<String,Object> searchMap= GeneralSearchUtility.deserializationToMap(searchCondition);
        //String departmentId="";
        if(searchMap.get("searchInALL").toString().equals("是")){
            searchMap.remove("departmentId");
        }
        PageInfo<List<Map<String,Object>>> pageInfo=departmentUserService.getDepartmentUser(jb4DSession,pageNum,pageSize,searchMap);
        return JBuild4DResponseVo.success(JBuild4DResponseVo.GETDATASUCCESSMSG,pageInfo);
    }

    @RequestMapping(value = "/StatusChange",method = RequestMethod.POST)
    public JBuild4DResponseVo statusChange(String ids,String status,HttpServletRequest request)
    {
        try {
            if(StringUtility.isEmpty(ids)){
                throw new JBuild4DGenerallyException("参数Ids不能为空或空串!");
            }
            if(StringUtility.isEmpty(status)){
                throw new JBuild4DGenerallyException("参数status不能为空或空串!");
            }
            JB4DSession jb4DSession=JB4DSessionUtility.getSession();
            //operationLogService.writeOperationLog(JB4DSessionUtility.getSession(), "单点登录",getModuleName(),actionName,getLogTypeName(),text,data,this.getClass(),request);
            departmentUserService.statusChange(jb4DSession,ids,status);
            return JBuild4DResponseVo.opSuccess();
        } catch (JBuild4DGenerallyException e) {
            return JBuild4DResponseVo.opError(e.getMessage());
        }
    }
}
