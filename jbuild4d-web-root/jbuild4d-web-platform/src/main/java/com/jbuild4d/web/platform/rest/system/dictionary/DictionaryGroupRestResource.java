package com.jbuild4d.web.platform.rest.system.dictionary;

import com.jbuild4d.base.dbaccess.dbentities.systemsetting.DictionaryGroupEntity;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.web.platform.rest.base.GeneralRestResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/PlatFormRest/System/DictionaryGroup")
public class DictionaryGroupRestResource extends GeneralRestResource<DictionaryGroupEntity> {


    @Autowired
    IDictionaryGroupService dictionaryGroupService;

    @Override
    protected IBaseService<DictionaryGroupEntity> getBaseService() {
        return dictionaryGroupService;
    }

    @Override
    public String getJBuild4DSystemName() {
        return this.jBuild4DSystemName;
    }

    @Override
    public String getModuleName() {
        return "数据字典分组";
    }

    @RequestMapping(value = "/MoveUp", method = RequestMethod.POST)
    public JBuild4DResponseVo moveUp(String recordId) {
        //dictionaryGroupService.moveUp(recordId);
        return JBuild4DResponseVo.opSuccess();
    }

    @RequestMapping(value = "/GetTreeData", method = RequestMethod.POST)
    public List<DictionaryGroupEntity> getTreeData() {
        //dictionaryGroupService.moveUp(recordId);
        List<DictionaryGroupEntity> dictionaryGroupEntityList=dictionaryGroupService.getALL(JB4DSessionUtility.getSession());
        return dictionaryGroupEntityList;
    }

}
