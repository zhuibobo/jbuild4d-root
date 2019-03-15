package com.jbuild4d.web.platform.rest.sso.organ;

import com.jbuild4d.base.dbaccess.dbentities.files.FileInfoEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganTypeEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.platform.files.service.IFileInfoService;
import com.jbuild4d.platform.sso.service.IOrganService;
import com.jbuild4d.platform.sso.service.IOrganTypeService;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/Organ")
public class OrganRestResource extends GeneralRestResource<OrganEntity> {

    @Autowired
    IOrganService organService;

    @Autowired
    IOrganTypeService organTypeService;

    @Autowired
    IFileInfoService fileInfoService;

    @Override
    protected IBaseService<OrganEntity> getBaseService() {
        return organService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "组织管理";
    }

    @Override
    protected Map<String, Object> bindObjectsToMV() {
        List<OrganTypeEntity> organTypeEntityList=organTypeService.getALL(JB4DSessionUtility.getSession());
        Map<String,Object> result=new HashMap<>();
        result.put("OrganType",organTypeEntityList);
        return result;
    }

    @RequestMapping(value = "/UploadOrganLogo", method = RequestMethod.POST, produces = "application/json")
    public JBuild4DResponseVo uploadOrganLogo(HttpServletRequest request, @RequestParam("file") MultipartFile file) throws IOException {
        FileInfoEntity fileInfoEntity=fileInfoService.addSmallFileToDB(JB4DSessionUtility.getSession(),file);
        return JBuild4DResponseVo.success(JBuild4DResponseVo.SUCCESSMSG,fileInfoEntity);
    }

    @RequestMapping(value = "/GetOrganLogo", method = RequestMethod.GET, produces = MediaType.IMAGE_PNG_VALUE)
    public byte[] getOrganLogo(String fileId) throws IOException, JBuild4DGenerallyException {
        FileInfoEntity fileInfoEntity=fileInfoService.getByPrimaryKey(JB4DSessionUtility.getSession(),fileId);
        if(fileInfoEntity==null) {
            //String cacheKey = "LogoDefaultImage";
            if (JB4DCacheManager.exist(JB4DCacheManager.jb4dPlatformBuilderCacheName, JB4DCacheManager.CACHE_KEY_ORGAN_LOGO)) {
                return JB4DCacheManager.getObject(JB4DCacheManager.jb4dPlatformBuilderCacheName, JB4DCacheManager.CACHE_KEY_ORGAN_LOGO);
            } else {
                InputStream is = this.getClass().getResourceAsStream("/static/Themes/Default/Css/Images/DefaultLogo.png");
                byte[] defaultImageByte = IOUtils.toByteArray(is);
                is.close();
                JB4DCacheManager.put(JB4DCacheManager.jb4dPlatformBuilderCacheName, JB4DCacheManager.CACHE_KEY_ORGAN_LOGO, defaultImageByte);
                return defaultImageByte;
            }
        }
        else{
            return fileInfoService.getContent(fileId);
        }
    }

    @RequestMapping(value = "/GetFullOrgan", method = RequestMethod.POST)
    public JBuild4DResponseVo getFullOrgan() {
        List<OrganEntity> organEntityList=organService.getALL(JB4DSessionUtility.getSession());
        return JBuild4DResponseVo.success(JBuild4DResponseVo.GETDATASUCCESSMSG,organEntityList);
    }

    @RequestMapping(value = "/DeleteByName",method = RequestMethod.DELETE)
    public JBuild4DResponseVo deleteByName(String organName,String warningOperationCode){
        organService.deleteByOrganName(JB4DSessionUtility.getSession(),organName,warningOperationCode);
        return JBuild4DResponseVo.deleteSuccess();
    }

    @RequestMapping(value = "/DeleteByOrganId",method = RequestMethod.DELETE)
    public JBuild4DResponseVo deleteByOrganId(String organId,String warningOperationCode) throws JBuild4DGenerallyException {
        organService.deleteByKeyNotValidate(JB4DSessionUtility.getSession(),organId,warningOperationCode);
        return JBuild4DResponseVo.deleteSuccess();
    }
}
