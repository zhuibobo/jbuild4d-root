package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.DictionaryGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.system.DictionaryEntity;
import com.jbuild4d.base.dbaccess.dbentities.system.DictionaryGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import com.jbuild4d.platform.system.service.IDictionaryService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class DictionaryGroupServiceImpl extends BaseServiceImpl<DictionaryGroupEntity> implements IDictionaryGroupService {

    DictionaryGroupMapper dictionaryGroupMapper;

    public DictionaryGroupServiceImpl(DictionaryGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        dictionaryGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DictionaryGroupEntity record) throws JBuild4DGenerallyException {
        //判定是否存在同Value的记录
        DictionaryGroupEntity theSameValueEntity=dictionaryGroupMapper.selectByValue(record.getDictGroupValue());
        if(theSameValueEntity!=null) {
            if (!theSameValueEntity.getDictGroupId().equals(record.getDictGroupId())){
                throw new JBuild4DGenerallyException("已经存在相同Value的记录!");
            }
        }
        return super.save(jb4DSession,id, record, new IAddBefore<DictionaryGroupEntity>() {
            @Override
            public DictionaryGroupEntity run(JB4DSession jb4DSession1,DictionaryGroupEntity item) throws JBuild4DGenerallyException {
                item.setDictGroupOrderNum(dictionaryGroupMapper.nextOrderNum());
                item.setDictGroupStatus(EnableTypeEnum.enable.getDisplayName());
                item.setDictGroupCreateTime(new Date());
                return item;
            }
        });
    }

    @Override
    public void statusChange(JB4DSession jb4DSession,String ids,String status) {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                DictionaryGroupEntity dictionaryGroupEntity = getByPrimaryKey(jb4DSession, idArray[i]);
                dictionaryGroupEntity.setDictGroupStatus(status);
                dictionaryGroupMapper.updateByPrimaryKeySelective(dictionaryGroupEntity);
            }
        }
    }

    @Override
    public int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DictionaryGroupEntity dictionaryGroupEntity=dictionaryGroupMapper.selectByPrimaryKey(id);
        if(dictionaryGroupEntity!=null){
            if(dictionaryGroupEntity.getDictGroupIssystem().equals(TrueFalseEnum.True.getDisplayName())){
                throw JBuild4DGenerallyException.getSystemRecordDelException();
            }
            if(dictionaryGroupEntity.getDictGroupDelEnable().equals(TrueFalseEnum.False.getDisplayName())){
                throw JBuild4DGenerallyException.getDBFieldSettingDelException();
            }
            List<DictionaryGroupEntity> childEntityList=dictionaryGroupMapper.selectChilds(id);
            if(childEntityList!=null&&childEntityList.size()>0){
                throw JBuild4DGenerallyException.getHadChildDelException();
            }
            return super.deleteByKey(jb4DSession, id);
        }
        else
        {
            throw new JBuild4DGenerallyException("找不到要删除的记录!");
        }
    }

    @Override
    public void initSystemData(JB4DSession jb4DSession, IDictionaryService dictionaryService) throws JBuild4DGenerallyException {
        //根字典分组
        String rootDictionaryId="0";
        DictionaryGroupEntity rootDictionaryGroupEntity=getDictionaryGroup(rootDictionaryId,"数据字典分组","数据字典分组","","-1",TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        deleteByKeyNotValidate(jb4DSession,rootDictionaryGroupEntity.getDictGroupId());
        save(jb4DSession,rootDictionaryGroupEntity.getDictGroupId(),rootDictionaryGroupEntity);

        String DevDemoDictionaryGroupRootId="DevDemoDictionaryGroupRoot";
        DictionaryGroupEntity devDemoDictionaryGroupEntity=getDictionaryGroup(DevDemoDictionaryGroupRootId,"开发示例","开发示例","",rootDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        deleteByKeyNotValidate(jb4DSession,devDemoDictionaryGroupEntity.getDictGroupId());
        save(jb4DSession,devDemoDictionaryGroupEntity.getDictGroupId(),devDemoDictionaryGroupEntity);

        String DevDemoDictionaryGroupBindSelect="DevDemoDictionaryGroupBindSelect";
        DictionaryGroupEntity DevDemoDictionaryGroupBindSelectEntity=getDictionaryGroup(DevDemoDictionaryGroupBindSelect,"DevDemoDictionaryGroupBindSelect","绑定下拉列表","",devDemoDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        deleteByKeyNotValidate(jb4DSession,DevDemoDictionaryGroupBindSelectEntity.getDictGroupId());
        save(jb4DSession,DevDemoDictionaryGroupBindSelectEntity.getDictGroupId(),DevDemoDictionaryGroupBindSelectEntity);

        String DevDemoDictionaryGroupBindRadio="DevDemoDictionaryGroupBindRadio";
        DictionaryGroupEntity DevDemoDictionaryGroupBindRadioEntity=getDictionaryGroup(DevDemoDictionaryGroupBindRadio,"DevDemoDictionaryGroupBindRadio","绑定单选项","",devDemoDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        deleteByKeyNotValidate(jb4DSession,DevDemoDictionaryGroupBindRadioEntity.getDictGroupId());
        save(jb4DSession,DevDemoDictionaryGroupBindRadioEntity.getDictGroupId(),DevDemoDictionaryGroupBindRadioEntity);

        String DevDemoDictionaryGroupBindCheckbox="DevDemoDictionaryGroupBindCheckbox";
        DictionaryGroupEntity DevDemoDictionaryGroupBindCheckboxEntity=getDictionaryGroup(DevDemoDictionaryGroupBindCheckbox,"DevDemoDictionaryGroupBindCheckbox","绑定复选项","",devDemoDictionaryGroupEntity.getDictGroupId(),TrueFalseEnum.True.getDisplayName(),TrueFalseEnum.True.getDisplayName());
        deleteByKeyNotValidate(jb4DSession,DevDemoDictionaryGroupBindCheckboxEntity.getDictGroupId());
        save(jb4DSession,DevDemoDictionaryGroupBindCheckboxEntity.getDictGroupId(),DevDemoDictionaryGroupBindCheckboxEntity);

        for(int i=0;i<10;i++){
            String select_dic_id=DevDemoDictionaryGroupBindSelect+String.valueOf(i);
            DictionaryEntity selectDictionaryEntity=getDictionary(DevDemoDictionaryGroupBindSelect,select_dic_id,DevDemoDictionaryGroupBindSelect,"Select-Key-"+i,"Select-Value-"+i,"Select-Text-"+i);
            dictionaryService.deleteByKeyNotValidate(jb4DSession,select_dic_id);
            dictionaryService.save(jb4DSession,select_dic_id,selectDictionaryEntity);

            String radio_dic_id=DevDemoDictionaryGroupBindRadio+String.valueOf(i);
            DictionaryEntity radioDictionaryEntity=getDictionary(DevDemoDictionaryGroupBindRadio,radio_dic_id,DevDemoDictionaryGroupBindRadio,"Radio-Key-"+i,"Radio-Value-"+i,"Radio-Text-"+i);
            dictionaryService.deleteByKeyNotValidate(jb4DSession,radio_dic_id);
            dictionaryService.save(jb4DSession,radio_dic_id,radioDictionaryEntity);

            String checkbox_dic_id=DevDemoDictionaryGroupBindCheckbox+String.valueOf(i);
            DictionaryEntity checkboxDictionaryEntity=getDictionary(DevDemoDictionaryGroupBindCheckbox,checkbox_dic_id,DevDemoDictionaryGroupBindCheckbox,"Checkbox-Key-"+i,"Checkbox-Value-"+i,"Checkbox-Text-"+i);
            dictionaryService.deleteByKeyNotValidate(jb4DSession,checkbox_dic_id);
            dictionaryService.save(jb4DSession,checkbox_dic_id,checkboxDictionaryEntity);
        }
    }

    public DictionaryGroupEntity getDictionaryGroup(String id,String value,String text,String desc,String parendId,String isSystem,String delEnable){
        DictionaryGroupEntity dictionaryGroupEntity=new DictionaryGroupEntity();
        dictionaryGroupEntity.setDictGroupId(id);
        dictionaryGroupEntity.setDictGroupValue(value);
        dictionaryGroupEntity.setDictGroupText(text);
        dictionaryGroupEntity.setDictGroupDesc(desc);
        dictionaryGroupEntity.setDictGroupParentId(parendId);
        dictionaryGroupEntity.setDictGroupIssystem(isSystem);
        dictionaryGroupEntity.setDictGroupDelEnable(delEnable);
        dictionaryGroupEntity.setDictGroupEnpItem(TrueFalseEnum.True.getDisplayName());
        return dictionaryGroupEntity;
    }

    public DictionaryEntity getDictionary(String parentId, String id, String groupId, String key, String value, String text){
        DictionaryEntity dictionaryEntity=new DictionaryEntity();
        dictionaryEntity.setDictId(id);
        dictionaryEntity.setDictIsSelected("否");
        dictionaryEntity.setDictStatus("启用");
        dictionaryEntity.setDictParentId(parentId);
        dictionaryEntity.setDictDelEnable("是");
        dictionaryEntity.setDictIssystem("是");
        dictionaryEntity.setDictGroupId(groupId);
        dictionaryEntity.setDictKey(key);
        dictionaryEntity.setDictText(text);
        dictionaryEntity.setDictValue(value);
        return dictionaryEntity;
    }
}
