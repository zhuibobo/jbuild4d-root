package com.jbuild4d.web.platform.rest.sso.application;

import com.jbuild4d.base.dbaccess.dbentities.files.FileInfoEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.platform.files.service.IFileInfoService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/Application")
public class AppRestResource {

    @Autowired
    IFileInfoService fileInfoService;

    @RequestMapping(value = "/UploadAppLogo", method = RequestMethod.POST, produces = "application/json")
    public JBuild4DResponseVo uploadOrganLogo(HttpServletRequest request, @RequestParam("file") MultipartFile file) throws IOException {
        FileInfoEntity fileInfoEntity=fileInfoService.addSmallFileToDB(JB4DSessionUtility.getSession(),file);
        return JBuild4DResponseVo.success(JBuild4DResponseVo.SUCCESSMSG,fileInfoEntity);
    }

    @RequestMapping(value = "/GetAppLogo", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getOrganLogo(String fileId) throws IOException, JBuild4DGenerallyException {
        FileInfoEntity fileInfoEntity=fileInfoService.getByPrimaryKey(JB4DSessionUtility.getSession(),fileId);
        if(fileInfoEntity==null) {
            if (JB4DCacheManager.exist(JB4DCacheManager.jb4dPlatformBuilderCacheName, JB4DCacheManager.CACHE_KEY_SSO_APP_LOGO)) {
                return JB4DCacheManager.getObject(JB4DCacheManager.jb4dPlatformBuilderCacheName, JB4DCacheManager.CACHE_KEY_SSO_APP_LOGO);
            } else {
                InputStream is = this.getClass().getResourceAsStream("/static/Themes/Default/Css/Images/DefaultSSOAppLogo.png");
                byte[] defaultImageByte = IOUtils.toByteArray(is);
                is.close();
                JB4DCacheManager.put(JB4DCacheManager.jb4dPlatformBuilderCacheName, JB4DCacheManager.CACHE_KEY_SSO_APP_LOGO, defaultImageByte);
                return defaultImageByte;
            }
        }
        else{
            return fileInfoService.getContent(fileId);
        }
    }

}
