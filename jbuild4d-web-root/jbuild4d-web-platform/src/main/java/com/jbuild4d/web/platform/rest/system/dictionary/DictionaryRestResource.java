package com.jbuild4d.web.platform.rest.system.dictionary;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.DictionaryEntity;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.system.service.IDictionaryService;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/System/Dictionary")
public class DictionaryRestResource extends GeneralRestResource<DictionaryEntity> {

    @Autowired
    IDictionaryService dictionaryService;

    @Override
    protected IBaseService<DictionaryEntity> getBaseService() {
        return dictionaryService;
    }

    @RequestMapping(value = "/GetListDataByGroupId", method = RequestMethod.POST)
    public JBuild4DResponseVo getListDataByGroupId(String groupId) {
        List<DictionaryEntity> dictionaryEntityList=dictionaryService.getListDataByGroupId(JB4DSessionUtility.getSession(),groupId);
        return JBuild4DResponseVo.success("",dictionaryEntityList);
    }

    @RequestMapping(value = "/SetSelected", method = RequestMethod.POST)
    public JBuild4DResponseVo setSelected(String recordId) throws JBuild4DGenerallyException {
        dictionaryService.setSelected(JB4DSessionUtility.getSession(),recordId);
        return JBuild4DResponseVo.opSuccess();
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "数据字典";
    }

}
